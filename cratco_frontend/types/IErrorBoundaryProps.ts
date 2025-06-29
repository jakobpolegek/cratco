export interface IErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}
