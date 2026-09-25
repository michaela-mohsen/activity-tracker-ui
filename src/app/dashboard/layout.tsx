import NavTabs from "../components/NavTabs";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <NavTabs />
            {children}
        </div>
    );
}