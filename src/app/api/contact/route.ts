import nodemailer from "nodemailer";

type ContactPayload = {
    fullName: string;
    phone: string;
    email: string;
    message: string;
    // honeypot anti-spam
    company?: string;
};

// Rate limiter simple en memoria (en producción usar Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hora
const MAX_REQUESTS_PER_WINDOW = 3; // 3 mensajes por hora

function checkRateLimit(identifier: string): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const record = rateLimitMap.get(identifier);

    // Si no existe o ya expiró, crear nuevo registro
    if (!record || now > record.resetTime) {
        rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
        return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1 };
    }

    // Si ya alcanzó el límite
    if (record.count >= MAX_REQUESTS_PER_WINDOW) {
        return { allowed: false, remaining: 0 };
    }

    // Incrementar contador
    record.count++;
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - record.count };
}

// Limpiar registros expirados cada 10 minutos
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitMap.entries()) {
        if (now > value.resetTime) {
            rateLimitMap.delete(key);
        }
    }
}, 10 * 60 * 1000);

function escapeHtml(str: string) {
    return str
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
    try {
        // Obtener IP del cliente
        const forwarded = req.headers.get("x-forwarded-for");
        const ip = forwarded ? forwarded.split(",")[0] : req.headers.get("x-real-ip") || "unknown";

        const body = (await req.json()) as Partial<ContactPayload>;

        const fullName = (body.fullName ?? "").trim();
        const phone = (body.phone ?? "").trim();
        const email = (body.email ?? "").trim();
        const message = (body.message ?? "").trim();
        const company = (body.company ?? "").trim(); // honeypot

        // Honeypot: si viene lleno, es casi seguro bot → fingimos éxito
        if (company) {
            return Response.json({ ok: true }, { status: 200 });
        }

        // Validaciones mínimas
        if (!fullName || !phone || !email || !message) {
            return Response.json(
                { ok: false, error: "Faltan campos obligatorios." },
                { status: 400 }
            );
        }

        if (!isValidEmail(email)) {
            return Response.json(
                { ok: false, error: "El correo no es válido." },
                { status: 400 }
            );
        }

        // Rate limiting por IP
        const ipLimit = checkRateLimit(`ip:${ip}`);
        if (!ipLimit.allowed) {
            return Response.json(
                {
                    ok: false,
                    error: "Has enviado demasiados mensajes. Por favor intenta más tarde.",
                },
                { status: 429 }
            );
        }

        // Rate limiting por email (más permisivo)
        const emailLimit = checkRateLimit(`email:${email.toLowerCase()}`);
        if (!emailLimit.allowed) {
            return Response.json(
                {
                    ok: false,
                    error:
                        "Ya has enviado varios mensajes recientemente. Por favor espera antes de enviar otro.",
                },
                { status: 429 }
            );
        }

        const host = process.env.EMAIL_HOST;
        const user = process.env.EMAIL_USER;
        const pass = process.env.EMAIL_PASSWORD;
        const from = process.env.EMAIL_FROM;
        const to = process.env.EMAIL_TO;
        const fromName = process.env.EMAIL_FROM_NAME || "Nexhora App";

        if (!host || !user || !pass || !from || !to) {
            return Response.json(
                {
                    ok: false,
                    error:
                        "Faltan variables de entorno de correo (EMAIL_HOST/USER/PASSWORD/FROM/TO).",
                },
                { status: 500 }
            );
        }

        const transporter = nodemailer.createTransport({
            host,
            port: Number(process.env.EMAIL_PORT || 465),
            secure: String(process.env.EMAIL_SECURE || "true").toLowerCase() === "true",
            auth: { user, pass },
        });

        const subject = `Nuevo contacto - ${fullName}`;

        const safeFullName = escapeHtml(fullName);
        const safePhone = escapeHtml(phone);
        const safeEmail = escapeHtml(email);
        const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>");

        await transporter.sendMail({
            from: `"${fromName}" <${from}>`,
            to,
            replyTo: email, // para responder directo al usuario
            subject,
            text:
                `Nuevo mensaje de contacto\n\n` +
                `Nombre: ${fullName}\n` +
                `Teléfono: ${phone}\n` +
                `Email: ${email}\n\n` +
                `Mensaje:\n${message}\n`,
            html: `
                <h2>Nuevo mensaje de contacto</h2>
                <p><b>Nombre completo:</b> ${safeFullName}</p>
                <p><b>Teléfono:</b> ${safePhone}</p>
                <p><b>Email:</b> ${safeEmail}</p>
                <p><b>Mensaje:</b><br/>${safeMessage}</p>
            `,
        });

        return Response.json({ ok: true }, { status: 200 });
    } catch (err) {
        console.error(err);
        return Response.json(
            { ok: false, error: "Error enviando el mensaje." },
            { status: 500 }
        );
    }
}