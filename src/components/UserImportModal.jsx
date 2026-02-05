import { useState } from "react";
import { Users, FileSpreadsheet } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const UserImportModal = ({ onImportUsers }) => {
  const [open, setOpen] = useState(false);
  const [inputText, setInputText] = useState("");

  const handleImport = () => {
    // Parse input text - split by newlines and filter empty lines
    const names = inputText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (names.length === 0) {
      alert("Vui lòng nhập ít nhất một tên!");
      return;
    }

    // Convert names to user objects with auto-generated IDs
    const users = names.map((name, index) => ({
      id: `user-${Date.now()}-${index}`,
      name: name,
    }));

    onImportUsers(users);
    setInputText("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 bg-white hover:bg-gray-50 border-2 border-gray-300"
        >
          <Users className="w-4 h-4" />
          Nhập danh sách
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-125 bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileSpreadsheet className="w-5 h-5 text-red-600" />
            Nhập danh sách người chơi
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Copy danh sách tên từ Excel (một cột) và paste vào đây. Mỗi tên trên
            một dòng.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-700">
              Danh sách tên (mỗi dòng một người)
            </label>
            <Textarea
              placeholder={`Ví dụ:\nNguyễn Văn A\nHuỳnh Thiện B\nTrần Thị C`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-50 font-mono text-sm"
            />
            <p className="text-xs text-gray-500">
              💡 Mẹo: Chọn cột tên trong Excel, copy (Ctrl+C), và paste (Ctrl+V)
              vào đây
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setInputText("");
              setOpen(false);
            }}
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleImport}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Nhập danh sách (
            {inputText.split("\n").filter((l) => l.trim()).length} người)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
