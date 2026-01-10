import "./globals.css";
import { Zen_Kaku_Gothic_New } from 'next/font/google'
import Header  from "@/components/Header";

const zenKaku = Zen_Kaku_Gothic_New({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className={zenKaku.className}>
      <head>
        <title>virtual pantry</title>
      </head>
      <body className="m-8 ">
        <Header />  
        <div className="mx-auto max-w-4xl mt-16">     
          {children}
        </div>
      </body>
    </html>
  )
}