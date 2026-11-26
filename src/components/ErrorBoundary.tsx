import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error.message || 'Terjadi kendala saat memuat halaman.',
    };
  }

  render() {
    if (this.state.hasError) {
      let friendlyMessage =
        'Maaf, terjadi gangguan teknis saat memproses data. Silakan muat ulang halaman.';
      if (this.state.message.includes('Missing or insufficient permissions')) {
        friendlyMessage =
          'Akses data ditolak oleh aturan keamanan Firestore. Pastikan Anda masuk dengan akun yang memiliki izin.';
      }
      return (
        <div className="min-h-screen bg-[#FBF9F5] flex items-center justify-center px-6 py-16">
          <div className="max-w-lg w-full bg-white border border-stone-200 p-8 text-center">
            <p className="text-xs uppercase tracking-widest text-stone-500 mb-3">
              Pemberitahuan Sistem
            </p>
            <h1 className="text-2xl font-serif text-stone-900 mb-3">
              Halaman Mengalami Kendala
            </h1>
            <p className="text-sm text-stone-600 leading-relaxed mb-6">{friendlyMessage}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-[#14532D] text-white text-sm font-medium hover:bg-[#0F3D21] transition-colors cursor-pointer"
            >
              Muat Ulang Halaman
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
