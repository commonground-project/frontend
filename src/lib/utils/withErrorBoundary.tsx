import ErrorBoundary from "@/components/AppShell/ErrorBoundary";

export default function withErrorBoundary<P extends object>(
    Component: React.ComponentType<P>,
) {
    const ComponentWithBoundary = (props: P) => (
        <ErrorBoundary>
            <Component {...props} />
        </ErrorBoundary>
    );

    ComponentWithBoundary.displayName = Component.displayName || Component.name;

    return ComponentWithBoundary;
}
