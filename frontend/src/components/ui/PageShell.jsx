import Navbar from "../Navbar.jsx";
import Footer from "../Footer.jsx";

export default function PageShell({ children }) {
    return (
        <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
            <Navbar />
            <div className="pt-16">{children}</div>
            <Footer />
        </div>
    );
}
