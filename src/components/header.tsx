import { BellDot, ChartNoAxesCombined, ExternalLink, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Link, useLocation } from "react-router-dom";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "./ui/sheet";

export function Header() {
  const location = useLocation();
  const [activeButton, setActiveButton] = useState(location.pathname);
  const [responsive, setResponsive] = useState("desktop");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setResponsive(window.innerWidth < 1024 ? "tablet" : "desktop");
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleButtonClick = (path: string) => setActiveButton(path);

  return (
    <header className="flex justify-between py-6 px-8 items-center">
      <div className="flex items-end gap-1">
        <div className="bg-gradient-to-tr to-slate-950 from-slate-800 rounded-2xl px-2 py-2">
          <ChartNoAxesCombined className="size-5 text-secondary" />
        </div>
        <strong className="text-lg text-muted-foreground font-[SUSE]">ERP NET</strong>
      </div>
      {responsive === "tablet" ? (
        <nav className="flex gap-5 items-center">
          <div className="flex gap-3 items-center">
            <div>
              <Input type="search" placeholder="Pesquisar..." />
            </div>
            <div className="bg-white rounded-full p-3.5">
              <BellDot className="size-5 text-muted-foreground" />
            </div>
          </div>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text- hover:text-primary"
                aria-label="Abrir menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-semibold">Menu</span>
                  <SheetClose asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-primary"
                      aria-label="Fechar menu"
                    >

                    </Button>
                  </SheetClose>
                </div>
                <nav className="flex-grow space-y-4">
                  <Link to="/">
                    <Button
                      className={`w-full rounded-full  h-12 text-sm ${activeButton === "/" ? "bg-gradient-to-r text-muted from-slate-950 to-slate-800 hover:text-white" : "bg-transparent"
                        }`}
                      variant="outline"
                      onClick={() => handleButtonClick("/")}
                    >
                      Dashboard
                    </Button>
                  </Link>
                  <Link to="/finances">
                    <Button
                      className={`rounded-full h-12 w-full text-sm ${activeButton === "/finances"
                        ? "bg-gradient-to-r text-muted from-slate-950 to-slate-800 hover:text-white"
                        : "bg-transparent"
                        }`}
                      variant="outline"
                      onClick={() => handleButtonClick("/finances")}
                    >
                      Financeiro
                    </Button>
                  </Link>
                  <Button
                    className={`rounded-full h-12 w-full text-sm ${activeButton === "/drh" ? "bg-gradient-to-r text-muted from-slate-950 to-slate-800 hover:text-white" : "bg-transparent"
                      }`}
                    variant="outline"
                    onClick={() => handleButtonClick("/drh")}
                  >
                    DRH
                  </Button>
                  <Button
                    className={`rounded-full h-12 w-full text-sm ${activeButton === "/trafego"
                      ? "bg-gradient-to-r text-muted from-slate-950 to-slate-800 hover:text-white"
                      : "bg-transparent"
                      }`}
                    variant="outline"
                    onClick={() => handleButtonClick("/trafego")}
                  >
                    Tráfego
                  </Button>

                </nav>
                <a href="https://glpiamazoniainter.com/glpi" target="_blank" rel="noopener noreferrer">
                  <Button
                    className="h-12 w-full text-sm flex items-center gap-1 hover:bg-gradient-to-r from-slate-950 to-slate-800"
                    variant="link"
                  >
                    Suporte
                    <ExternalLink className="size-2.5 mb-2" />
                  </Button>
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      ) : (
        <nav className="flex gap-5 items-center">
          <Link to="/">
            <Button
              className={`rounded-full h-12 w-32 text-sm ${activeButton === "/" ? "bg-gradient-to-r text-muted from-slate-950 to-slate-800 hover:text-white" : "bg-transparent"
                }`}
              variant="outline"
              onClick={() => handleButtonClick("/")}
            >
              Dashboard
            </Button>
          </Link>
          <Link to="/finances">
            <Button
              className={`rounded-full h-12 w-32 text-sm ${activeButton === "/finances"
                ? "bg-gradient-to-r text-muted from-slate-950 to-slate-800 hover:text-white"
                : "bg-transparent"
                }`}
              variant="outline"
              onClick={() => handleButtonClick("/finances")}
            >
              Financeiro
            </Button>
          </Link>
          <Button
            className={`rounded-full h-12 w-32 text-sm ${activeButton === "/drh" ? "bg-gradient-to-r text-muted from-slate-950 to-slate-800 hover:text-white" : "bg-transparent"
              }`}
            variant="outline"
            onClick={() => handleButtonClick("/drh")}
          >
            DRH
          </Button>
          <Button
            className={`rounded-full h-12 w-32 text-sm ${activeButton === "/trafego" ? "bg-gradient-to-r text-muted from-slate-950 to-slate-800 hover:text-white" : "bg-transparent"
              }`}
            variant="outline"
            onClick={() => handleButtonClick("/trafego")}
          >
            Tráfego
          </Button>
          <a href="https://glpiamazoniainter.com/glpi" target="_blank" rel="noopener noreferrer">
            <Button
              className="h-12 w-32 text-sm flex items-center hover:border-gradient-to-r from-slate-950 to-slate-800 "
              variant="link"
            >
              Suporte
              <ExternalLink className="size-2.5 mb-2" />
            </Button>
          </a>
        </nav>
      )}
      <div className={responsive != 'desktop' ? "hidden" : "flex gap-3 items-center"}>
        <div>
          <Input type="search" placeholder="Pesquisar..." />
        </div>
        <div className="bg-white rounded-full p-3.5">
          <BellDot className="size-5 text-muted-foreground" />
        </div>
      </div>
    </header >
  );
}
