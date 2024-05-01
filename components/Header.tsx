import ExportedImage from "next-image-export-optimizer";
import logo from "../public/pantry.png";
import Link from 'next/link';

const Header = () => {
  return (
    <header className="flex my-8">
      <div className="flex items-center mx-auto">
        <Link href="/">
          <h1 className="mr-4 text-2xl">virtual pantry</h1>
        </Link>
        <Link href="/">
          <ExportedImage src={logo} alt="Logo" width={80} height={80} unoptimized={true}/>
        </Link>
      </div>
      <div className="absolute top- right-8 flex space-x-4">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
      </div>
    </header>
  );
};
export default Header;