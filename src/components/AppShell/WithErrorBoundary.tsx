import { ErrorBoundary } from "react-error-boundary";
import ErrorFallBack from "./ErrorFallBack";

export default function withErrorBoundary<P extends object>(
    Component: React.ComponentType<P>,
) {
    const ComponentWithBoundary = (props: P) => (
        <ErrorBoundary FallbackComponent={ErrorFallBack}>
            <Component {...props} />
        </ErrorBoundary>
    );

    ComponentWithBoundary.displayName = Component.displayName || Component.name;

    return ComponentWithBoundary;
}
