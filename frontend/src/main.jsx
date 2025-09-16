import React from "react"; // libreria de react
import ReactDOM from "react-dom/client"; // libreria renderizado del dom de react
import App from "./App.jsx"; // componente principal
import "./index.css"; // hoja de estilos

// Creación del componente ErrorBoundary para manejar errores
class ErrorBoundary extends React.Component {
  // se extiende de React.Component para usar metodos de react como el ciclo de vida
  constructor(props) {
    // inicializacion del componente
    super(props); // llamada al constructor de la clase padre (React.Component) y poder usar sus metodos como this
    this.state = { hasError: false }; // estado del componente inicial false (no hay error)
  }

  static getDerivedStateFromError(error) {
    // captura los errores de componentes hijos (la app envuelta en el ErrorBoundary)
    return { hasError: true }; // actualiza el estado a true (hay error) no usa this porque es un metodo estatico (osea que es un metodo de la clase ErrorBoundary no de la instancia creada del componente)
  }

  componentDidCatch(error, errorInfo) {
    // se ejecuta cuando se captura un error
    console.error("Error capturado por ErrorBoundary:", error, errorInfo); // muestra el error en la consola con informacion adicional
  }

  render() {
    // renderiza el componente (dibuja el componente)
    if (this.state.hasError) {
      // si hay error
      return (
        // Muestra esto
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Algo salió mal
            </h1>
            <p className="text-gray-600 mb-4">
              Ha ocurrido un error inesperado. Por favor recarga la página.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Recargar página
            </button>
          </div>
        </div>
      );
    }
    // si no hay error dibuja el componente hijo (envuelto en el ErrorBoundary)
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* detecta errores */}
    <ErrorBoundary>
      {/* manejo de errores en toda la app */}
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
