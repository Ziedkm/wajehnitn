// app/page.tsx
import OrientationForm from '@/app/components/OrientationForm';
import Image from 'next/image';
import logo from '@/public/logo.png';
import { FloatingIcons } from './components/FloatingIcons';

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center p-4 sm:p-8 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 overflow-hidden">
      
      {/* Background Gradient - Set to lowest layer */}
      <div className="absolute inset-0 z-0 h-full w-full bg-white dark:bg-gray-900 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-400/20 opacity-50 blur-[100px]"></div>
      </div>

      {/* Floating Icons - Now they will be on a layer above the background */}
      <FloatingIcons />
      
      {/* Main Content - Set to the highest layer to be on top of everything */}
      <div className="w-full max-w-5xl text-center z-10 pt-16 sm:pt-20">
        <Image 
          src={logo} 
          alt="WajehniTN Logo" 
          width={1370}
          height={515}
          className="h-auto w-auto mx-auto mb-4"
          priority
        />

        <p className="mt-4 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          دليلك الشامل للتوجيه الجامعي في تونس. أدخل معدلاتك واكتشف مستقبلك الأكاديمي بثقة وسهولة.
        </p>

        <div className="mt-12">
          <OrientationForm />
        </div>
      </div>
    </main>
  );
}