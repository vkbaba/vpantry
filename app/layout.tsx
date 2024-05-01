import "./globals.css";
import localFont from 'next/font/local'
import Header  from "@/components/Header";

const myFont = localFont({
  src: './MoralerspaceNeon-Regular.woff2',
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={myFont.className}>
      <body className="m-8 ">
        <Header />  
        <div className="mx-auto max-w-4xl mt-16">     
          {children}
        </div>
      </body>
    </html>
  )
}