export default function DashboardPage() {
    return (
        <>
            {/* Welcome */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-foreground text-xl font-bold">Bienvenido, Admin</h2>
                    <p className="text-muted-foreground text-sm mt-0.5">
                        Aquí tienes un resumen de la actividad reciente.
                    </p>
                </div>

            </div>

            {/* Bottom grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    HOLA
                </div>
                <div>
                    HOLA
                </div>
            </div>
        </>
    )
}
