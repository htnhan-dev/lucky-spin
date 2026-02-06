// ============================================
// CONSTANTS - LUCKY SPIN SỰ KIỆN CAO CẤP
// ============================================

// Trạng thái game - REDESIGN theo flow mới
export const GAME_STATE = {
  IDLE: "idle", // Chưa bắt đầu - chờ chọn users
  AUTO_PICKING: "auto_picking", // Đang tự động chọn user (animation scroll)
  READY_TO_SPIN: "ready_to_spin", // Đã đủ 4 user, sẵn sàng quay vòng
  SPINNING: "spinning", // Đang quay vòng để chọn giải trần
  PRIZES_ALLOCATED: "prizes_allocated", // Đã phân bổ xong 4 giải, 4 bao shake (chờ mở)
  REVEALING: "revealing", // Đang mở bao để reveal giải
  ROUND_COMPLETE: "round_complete", // Hoàn thành 1 round (đã mở hết 4 bao)
};

// Trạng thái người chơi
export const USER_STATE = {
  WAITING: "waiting",
  SELECTED: "selected",
  WINNER: "winner",
};

// Màu sắc Tết Việt Nam - Truyền thống & Hiện đại
export const COLORS = {
  primary: {
    red: "#C81E1E", // đỏ lì xì
    darkRed: "#8B0000", // đỏ đậm
    gold: "#FFD700", // vàng kim
    lightGold: "#FFECB3", // vàng nhạt highlight
  },

  accent: {
    amber: "#F59E0B", // vàng amber cho highlight
    orange: "#F97316", // cam
  },

  neutral: {
    white: "#FFFFFF",
    black: "#000000",
    dark: "#1F2937",
    gray: "#6B7280",
    lightGray: "#9CA3AF",
  },

  effect: {
    glow: "rgba(255, 215, 0, 0.6)",
    shadow: "rgba(0, 0, 0, 0.35)",
  },
};

// Câu đối Tết Việt Nam
export const TET_GREETINGS = {
  left: "Phúc Lộc Thọ",
  right: "Tài Lộc Đông Đầy",
  top: "CHÚC MỪNG NĂM MỚI",
};

// Cấu hình animation - REDESIGN
export const ANIMATION_CONFIG = {
  autoPickUser: {
    duration: 0.8, // Animation mỗi user được chọn
    delay: 0.5, // Delay giữa các lần chọn
  },
  envelopeReveal: {
    duration: 0.6, // Animation bao lì xì mở
  },
  spin: {
    duration: 6, // FIXED 6s để đảm bảo timing sync chính xác (không còn giật)
    easing: [0.22, 1, 0.36, 1], // Ease out mượt mà: chậm dần tự nhiên như vòng quay thật
    rotations: 15, // 15 vòng quay để tăng độ kịch tính (nhiều vòng hơn)
  },
  winnerHighlight: {
    duration: 1.5, // Highlight người trúng
    delay: 0.3, // Delay sau khi wheel dừng
  },
  confetti: {
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  },
};

// Cấu hình vòng quay
export const WHEEL_CONFIG = {
  segments: 4,
  radius: 200,
  centerSize: 70,
  strokeWidth: 3,
};

// Vị trí bao lì xì (1 hàng ngang)
export const ENVELOPE_POSITIONS = [0, 1, 2, 3];

// Lời chúc Tết khi mở bao lì xì - 100+ câu
export const TET_BLESSINGS = [
  "Xuân sang gió nhẹ bên thềm,\nChúc anh chị mãi êm đềm bước xa.",
  "Năm mới mở lối mở nhà,\nCông danh vững bước, việc nhà an vui.",
  "Tết về lòng cũng thảnh thơi,\nBao nhiêu cố gắng nở tươi thành mùa.",
  "Một năm gắng sức sớm trưa,\nXuân sang chúc lại đủ vừa niềm tin.",
  "Xuân về mệt mỏi gửi xin,\nGiữ lại năng lượng, giữ tình đồng đội.",
  "Đi qua bao chuyện ngược xuôi,\nNăm mới chúc bạn an vui mỗi ngày.",
  "Xuân sang trang giấy mở ra,\nViết thêm thành quả, đậm đà niềm tin.",
  "Năm qua nỗ lực lặng thinh,\nXuân về quả ngọt tự sinh trong đời.",
  "Chúc cho tập thể rạng ngời,\nChung tay bền chí, chung lời thành công.",
  "Xuân sang mong ước mênh mông,\nViệc chung thuận lợi, việc riêng an hòa.",
  "Một năm vững bước đi qua,\nXuân về chúc bạn đậm đà niềm vui.",
  "Bao nhiêu áp lực ngược xuôi,\nXuân sang gói lại, gửi trôi cuối năm.",
  "Chúc cho công việc âm thầm,\nNgày thêm trôi chảy, tháng dần hanh thông.",
  "Xuân về nắng ấm trong lòng,\nMỗi người một hướng vẫn chung một đường.",
  "Năm mới vững chí kiên cường,\nBình an theo bước, yêu thương theo cùng.",
  "Xuân sang gió nhẹ đầu mùa,\nChúc cho mọi việc sớm vừa ý nhau.",
  "Đi làm không chỉ vì mau,\nMà vì giá trị bền lâu dựng xây.",
  "Năm mới chậm lại đôi giây,\nGiữ tâm an ổn, giữ tay vững vàng.",
  "Xuân về giữa chốn văn phòng,\nNụ cười lan tỏa nhẹ nhàng mỗi ngày.",
  "Chúc cho tập thể hôm nay,\nBền như rễ đất, cao như ngọn trời.",
  "Xuân sang lòng thấy thảnh thơi,\nViệc chung trọn vẹn, việc đời an nhiên.",
  "Một năm cố gắng không phiền,\nXuân về chúc lại bình yên đủ đầy.",
  "Đi cùng nhau suốt tháng ngày,\nNăm mới mong vẫn nắm tay vững vàng.",
  "Xuân sang nắng ấm dịu dàng,\nCông việc xuôi gió, đời càng thêm vui.",
  "Chúc cho mỗi buổi ngược xuôi,\nĐến công ty vẫn thấy vui trong lòng.",
  "Năm mới chẳng ước xa xông,\nChỉ mong ổn định, thong dong mỗi ngày.",
  "Xuân về chậm nhịp đôi tay,\nNhìn lại hành trình đã xây từng phần.",
  "Bao năm cùng bước xa gần,\nXuân sang mong vẫn ân cần sẻ chia.",
  "Chúc cho công việc trọn bề,\nKhông vội không gấp, vẫn về đích xa.",
  "Xuân sang gió mát hiên nhà,\nViệc chung thêm sáng, việc ta thêm bền.",
  "Một năm lặng lẽ dựng nền,\nXuân về mong thấy vững bền niềm tin.",
  "Chúc cho tập thể chúng mình,\nMỗi người tỏa sáng, vẫn tình đồng tâm.",
  "Xuân sang bỏ lại lo lầm,\nGiữ điều tích cực âm thầm lớn lên.",
  "Đi làm không chỉ gọi tên,\nMà là cùng tạo giá trị bền lâu.",
  "Năm mới chúc bạn bền sâu,\nTâm vững giữa những nhịp cầu đổi thay.",
  "Xuân về nắng trải bàn tay,\nChúc cho công việc mỗi ngày nhẹ hơn.",
  "Đi qua bao nỗi thiệt hơn,\nXuân sang mong được giản đơn an lành.",
  "Chúc cho mỗi bước đồng hành,\nThêm phần thấu hiểu, thêm nhanh niềm tin.",
  "Năm mới chẳng hứa cao xa,\nChỉ mong vững nhịp đi qua từng ngày.",
  "Xuân về chậm lại đôi giây,\nNghe lòng mách bảo điều hay nên làm.",
  "Chúc cho công việc âm thầm,\nNhưng luôn giá trị theo năm tháng dài.",
  "Xuân sang mong thấy nụ cười,\nTrên môi đồng nghiệp mỗi ngày gặp nhau.",
  "Năm mới gác lại lo âu,\nGiữ cho tinh thần bền lâu sáng ngời.",
  "Xuân về giữa nhịp đời trôi,\nChúc cho tập thể vẹn mười niềm tin.",
  "Đi cùng nhau chẳng một mình,\nXuân sang càng quý nghĩa tình bấy nhiêu.",
  "Chúc cho năm mới thật nhiều,\nAn vui trong việc, nhẹ chiều trong tâm.",
  "Xuân sang bỏ bớt xa xăm,\nGiữ điều thiết thực âm thầm nở hoa.",
  "Năm mới mong ước không xa,\nLàm việc tử tế, đời ta an hòa.",
  "Xuân về nắng ấm hiền hòa,\nCông ty là chốn để ta trưởng thành.",
  "Chúc cho mỗi bước đồng hành,\nThêm phần vững chãi, thêm nhanh niềm vui.",
  "Năm mới chẳng ước cao vời,\nChỉ mong bền bỉ cùng người cùng team.",
  "Xuân sang giữ trọn niềm tin,\nĐi xa mấy cũng không quên ban đầu.",
  "Chúc cho công việc bền lâu,\nGiá trị tạo dựng theo sau tháng ngày.",
  "Xuân về giữa chốn sum vầy,\nChúc nhau đủ sức dựng xây hành trình.",
  "Năm mới vững nhịp chính mình,\nGiữa bao thay đổi vẫn tình không phai.",
  "Xuân sang mong ước giản khai,\nMỗi ngày đi làm là ngày đáng mong.",
  "Chúc cho tập thể đồng lòng,\nĐi xa nhưng vẫn chung cùng một tâm.",
  "Xuân về gác lại âm thầm,\nMở ra hành trình xứng tầm đã qua.",
  "Chúc cho năm mới chan hòa,\nViệc chung thuận lợi, việc nhà an yên.",
  "Xuân sang giữa nhịp đời hiền,\nCùng nhau tiến bước bình yên bền dài.",
  "Chúc cho mỗi sớm tương lai,\nĐến công ty thấy mình hay hơn xưa.",
  "Xuân về gió nhẹ đầu mùa,\nChúc cho tất cả đủ vừa ước mong.",
  "Đi làm chẳng chỉ vì công,\nMà vì ý nghĩa đi cùng thời gian.",
  "Xuân sang chúc bạn an an,\nTrong tâm vững chãi, trong ngàn việc chung.",
  "Tết đến xuân về tràn đầy,\nChúc bạn mọi việc hanh thông mỗi ngày.",
  "Năm mới phúc lộc tràn đầy,\nSức khỏe dồi dào, tài lộc đầy nhà.",
  "Xuân sang đất trời đổi mới,\nChúc bạn thành công rạng rỡ như mai.",
  "Tết về niềm vui ngập tràn,\nVạn sự như ý, nghìn năm bình an.",
  "Năm mới chúc bạn hanh thông,\nCông danh tấn tới, gia đình viên mãn.",
  "Xuân về mang đến tài lộc,\nVạn sự cát tường, nghìn điều như ý.",
  "Tết sang chúc mừng năm mới,\nSức khỏe vàng son, tài lộc dồi dào.",
  "Năm mới như ý như mơ,\nCông việc thuận lợi, gia đình ấm no.",
  "Xuân sang phúc lộc kéo đến,\nChúc bạn vạn sự như ý lành.",
  "Tết đến chúc bạn bình an,\nNăm mới vui vẻ, sự nghiệp thăng hoa.",
  "Năm mới may mắn tràn đầy,\nTài lộc rủng rỉnh, hạnh phúc mỗi ngày.",
  "Xuân về đất trời sinh sôi,\nChúc bạn công danh thăng tiến rạng ngời.",
  "Tết sang phúc lộc dồi dào,\nVạn sự như ý, nghìn vàng đầy nhà.",
  "Năm mới chúc bạn thịnh vượng,\nCông việc hanh thông, đời sống viên mãn.",
  "Xuân sang tài lộc tràn trề,\nSức khỏe dẻo dai, niềm vui vẹn toàn.",
  "Tết về chúc phúc chúc tài,\nVạn điều như ý, nghìn lời tốt lành.",
  "Năm mới chúc bạn phát tài,\nCông danh rực rỡ, đời đời bình an.",
  "Xuân sang đón nhận may mắn,\nChúc bạn sức khỏe, tài lộc dồi dào.",
  "Tết đến niềm vui ngập tràn,\nNăm mới hanh thông, vạn sự như ý.",
  "Năm mới phúc lộc kép ba,\nTài lộc đầy nhà, sự nghiệp thăng hoa.",
  "Xuân về chúc bạn an khang,\nThịnh vượng tài lộc, sức khỏe dồi dàng.",
  "Tết sang vui vẻ sum vầy,\nNăm mới bình an, hạnh phúc mỗi ngày.",
  "Năm mới chúc bạn như ý,\nCông danh tấn tới, gia đạo viên mãn.",
  "Xuân sang tài lộc thịnh vượng,\nVạn sự như mơ, nghìn điều tốt lành.",
  "Tết về phúc lộc đầy nhà,\nChúc bạn sức khỏe, công danh rạng rỡ.",
  "Năm mới may mắn dồi dào,\nTài lộc rủng rỉnh, niềm vui ngập tràn.",
  "Xuân sang đón lộc đón tài,\nVạn sự hanh thông, nghìn năm bình an.",
  "Tết đến chúc bạn thành công,\nCông danh phát đạt, gia đình hạnh phúc.",
  "Năm mới phồn vinh thịnh vượng,\nChúc bạn sức khỏe, tài lộc kéo về.",
  "Xuân về như ý như mơ,\nVạn điều tốt lành, nghìn lời chúc phúc.",
  "Tết sang chúc bạn bình an,\nNăm mới hanh thông, công danh rực rỡ.",
  "Năm mới tài lộc dồi dào,\nSức khỏe tràn trề, niềm vui vẹn toàn.",
  "Xuân sang phúc lộc tràn đầy,\nVạn sự như ý, nghìn vui mỗi ngày.",
  "Tết về đón nhận may mắn,\nChúc bạn thành công, hạnh phúc viên mãn.",
  "Năm mới chúc bạn thịnh vượng,\nTài lộc kéo về, công danh thăng hoa.",
  "Xuân sang vui vẻ an khang,\nSức khỏe dồi dào, tài lộc đầy vang.",
  "Tết đến chúc phúc chúc lành,\nNăm mới hanh thông, vạn sự tốt đẹp.",
  "Năm mới như ý như mong,\nCông danh rạng rỡ, gia đình sum vầy.",
  "Xuân về tài lộc thịnh vượng,\nChúc bạn sức khỏe, niềm vui tràn trề.",
  "Tết sang phúc lộc song hành,\nVạn điều như ý, nghìn lành đến nhà.",
  "Năm mới chúc bạn phát đạt,\nTài lộc dồi dào, sự nghiệp vẻ vang.",
];
