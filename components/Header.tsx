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
          <img src="/pantry.png" alt="Logo" width={80} height={80} />
        </Link>
      </div>
    </header>
  );
};
export default Header;