// src/components/ErrorBoundary.jsx
import React from "react";
import { toast } from "react-hot-toast";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
    toast.error(`Something broke: ${error.message}`);
  }

  render() {
    if (this.state.hasError) {
      // reset view after showing toast
      this.setState({ hasError: false });
    }
    return this.props.children;
  }
}

export default ErrorBoundary;