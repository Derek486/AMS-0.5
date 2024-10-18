import { Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";

export default function AuthLayout({ title, onSubmit, footerText, link, linkText, buttonText, children }) {
  return (
    <>
      <div className="h-full w-full bg-smoke dark:bg-obsidian flex text-ocean dark:text-light-smoke">
        <form onSubmit={onSubmit} className="bg-light-smoke dark:bg-midnight shadow-md rounded-md m-auto p-8 flex flex-col gap-4 min-w-80">
          <h1 className="font-semibold text-lg text-center">{title}</h1>
          <div className="flex flex-col gap-6">
            {children}
            <footer className="flex flex-col gap-3">
              <Button type="submit" className="bg-sky rounded-sm py-2.5 w-full">
                {buttonText}
              </Button>
              <p className="text-sm text-center">{footerText} <Link className="text-ocean dark:text-light-sky text-opacity-80 dark:hover:text-opacity-60 hover:text-opacity-100 transition-colors font-semibold" to={link}>{linkText}</Link></p>
            </footer>
          </div>
        </form>
      </div>
    </>
  )
}