import { useEffect, useState } from "react";
import { Menu, Search, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";

interface HeaderProps {
  onMenuClick: () => void;
}

interface UserRow {
  coin_balance: number;
  level: number;
  name: string;
}

export function Header({ onMenuClick }: HeaderProps) {
  const [user, setUser] = useState<UserRow | null>(null);

  useEffect(() => {
    async function loadUser() {
      const res = await supabase
        .from("users")
        .select("coin_balance, level, name")
        .eq("id", 1)
        .maybeSingle();
      if (res.data) setUser(res.data);
    }
    loadUser();
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="hidden lg:flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              ЕГЭ
            </div>
            <span className="font-semibold text-slate-900 text-sm">ЕГЭ/ОГЭ Подготовка</span>
          </div>
        </div>

        <div className="hidden md:flex flex-1 max-w-sm mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Поиск заданий..." className="pl-10 h-9 bg-slate-50 border-slate-200 text-sm" disabled />
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200">
            <Coins className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-semibold text-slate-900">
              {user?.coin_balance?.toLocaleString() ?? 0}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10 border-2 border-blue-100">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=user1" />
              <AvatarFallback>{user?.name?.charAt(0) ?? "U"}</AvatarFallback>
            </Avatar>
            <Badge variant="secondary" className="hidden sm:flex text-xs bg-blue-100 text-blue-700 border-blue-200">
              Уровень {user?.level ?? 1}
            </Badge>
          </div>
        </div>
      </div>
    </header>
  );
}
