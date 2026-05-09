"use client";

import { Component, type ReactNode, type ErrorInfo } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/UI/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  label?: string;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex min-h-[200px] flex-col items-center justify-center rounded-[2rem] border border-red-200/40 bg-red-50/40 p-8 text-center dark:border-red-900/30 dark:bg-red-950/20">
          <AlertTriangle className="mb-3 size-8 text-red-400" />
          <h3 className="font-semibold text-zinc-900 dark:text-white">
            {this.props.label ?? "Service temporarily unavailable"}
          </h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {this.state.message || "This module encountered an error and could not load."}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4 rounded-full"
            onClick={() => this.setState({ hasError: false, message: "" })}
          >
            <RefreshCcw className="mr-2 size-3.5" />
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
