import React from 'react';

function Login() {
    return (
        <div>
            <form>
                <section>
                    <h3>Unirse a una sesión</h3>
                    <fieldset>
                        <input name="session" placeholder="No. de Sesión" />
                    </fieldset>
                    <fieldset>
                        <input name="name" placeholder="Tú Nombre" />
                    </fieldset>
                </section>

                <button>Entrar</button>
            </form>

            <form>
                <section>
                    <h3>Crear nueva sesión</h3>
                    <fieldset>
                        <input name="session" placeholder="Nombre de la Sesión" />
                    </fieldset>
                </section>

                <button>Crear</button>
            </form>
        </div>
    );
}

export default Login;
