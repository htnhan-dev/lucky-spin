// ============================================
// DỮ LIỆU MẪU - LUCKY SPIN SỰ KIỆN
// ============================================

// Danh sách người tham gia sự kiện
export const SAMPLE_USERS = [
  {
    id: "user-1",
    name: "Nguyễn Văn An",
    avatar: "https://i.pravatar.cc/150?img=1",
    department: "Kinh Doanh",
  },
  {
    id: "user-2",
    name: "Trần Thị Bình",
    avatar: "https://i.pravatar.cc/150?img=2",
    department: "Marketing",
  },
  {
    id: "user-3",
    name: "Lê Hoàng Cường",
    avatar: "https://i.pravatar.cc/150?img=3",
    department: "Công Nghệ",
  },
  {
    id: "user-4",
    name: "Phạm Thị Dung",
    avatar: "https://i.pravatar.cc/150?img=4",
    department: "Nhân Sự",
  },
  {
    id: "user-5",
    name: "Hoàng Văn Em",
    avatar: "https://i.pravatar.cc/150?img=5",
    department: "Tài Chính",
  },
  {
    id: "user-6",
    name: "Vũ Thị Phương",
    avatar: "https://i.pravatar.cc/150?img=6",
    department: "Kinh Doanh",
  },
  {
    id: "user-7",
    name: "Đặng Văn Giang",
    avatar: "https://i.pravatar.cc/150?img=7",
    department: "Marketing",
  },
  {
    id: "user-8",
    name: "Bùi Thị Hà",
    avatar: "https://i.pravatar.cc/150?img=8",
    department: "Công Nghệ",
  },
  {
    id: "user-9",
    name: "Ngô Văn Hùng",
    avatar: "https://i.pravatar.cc/150?img=9",
    department: "Vận Hành",
  },
  {
    id: "user-10",
    name: "Phan Thị Lan",
    avatar: "https://i.pravatar.cc/150?img=10",
    department: "Kinh Doanh",
  },
  {
    id: "user-11",
    name: "Trịnh Văn Minh",
    avatar: "https://i.pravatar.cc/150?img=11",
    department: "Tài Chính",
  },
  {
    id: "user-12",
    name: "Lý Thị Nga",
    avatar: "https://i.pravatar.cc/150?img=12",
    department: "Nhân Sự",
  },
];

// Danh sách giải thưởng cao cấp
// Weight = Tỷ trọng tương đối (càng cao càng dễ trúng)
// Tổng weight = 1 + 2 + 4 + 8 = 15
// Xác suất: Đặc Biệt 6.7%, Nhất 13.3%, Nhì 26.7%, Ba 53.3%
export const SAMPLE_PRIZES = [
  {
    id: "prize-1",
    name: "Giải Đặc Biệt",
    description: "iPhone 16 Pro Max",
    icon: "Trophy",
    color: "#FFD700", // Vàng
    quantity: 1,
    weight: 1, // 1/15 = 6.7%
    tier: "special",
  },
  {
    id: "prize-2",
    name: "Giải Nhất",
    description: "MacBook Air M3",
    icon: "Award",
    color: "#C0C0C0", // Bạc
    quantity: 1,
    weight: 2, // 2/15 = 13.3%
    tier: "first",
  },
  {
    id: "prize-3",
    name: "Giải Nhì",
    description: "iPad Air 2024",
    icon: "Medal",
    color: "#CD7F32", // Đồng
    quantity: 2,
    weight: 4, // 4/15 = 26.7%
    tier: "second",
  },
  {
    id: "prize-4",
    name: "Giải Ba",
    description: "Apple Watch Series 9",
    icon: "Gift",
    color: "#F97316", // Cam
    quantity: 5,
    weight: 8, // 8/15 = 53.3%
    tier: "third",
  },
];

// Helper: Lấy ngẫu nhiên users
export const getRandomUsers = (count = 4) => {
  const shuffled = [...SAMPLE_USERS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Helper: Chọn giải thưởng theo weighted random (tỷ trọng)
export const selectPrizeByWeight = (prizes) => {
  // Tính tổng weight
  const totalWeight = prizes.reduce((sum, prize) => sum + prize.weight, 0);

  // Random số từ 0 đến totalWeight
  let random = Math.random() * totalWeight;

  // Duyệt qua từng giải để tìm giải trúng
  for (const prize of prizes) {
    random -= prize.weight;
    if (random <= 0) {
      return prize;
    }
  }

  // Fallback: trả về giải cuối
  return prizes[prizes.length - 1];
};

// Helper: Reset số lượng giải thưởng
export const resetPrizes = () => {
  return SAMPLE_PRIZES.map((prize) => ({
    ...prize,
    remaining: prize.quantity,
  }));
};
