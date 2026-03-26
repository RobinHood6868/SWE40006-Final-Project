import { getPool } from './db.js';

export async function seedMoreProducts() {
  const client = await getPool().connect();
  try {
    // First, add more categories
    const existingCats = await client.query('SELECT slug FROM categories');
    const existingSlugs = existingCats.rows.map(r => r.slug);
    
    const newCategories = [
      { name: 'Máy tính bảng', slug: 'may-tinh-bang' },
      { name: 'TV & Thiết bị giải trí', slug: 'tv-thiet-bi-giai-tri' },
      { name: 'Thiết bị gaming', slug: 'thiet-bi-gaming' },
      { name: 'Máy ảnh', slug: 'may-anh' },
      { name: 'Loa & Âm thanh', slug: 'loa-am-thanh' },
      { name: 'Phụ kiện máy tính', slug: 'phu-kien-may-tinh' },
    ];
    
    for (const cat of newCategories) {
      if (!existingSlugs.includes(cat.slug)) {
        await client.query(
          'INSERT INTO categories (name, slug) VALUES ($1, $2)',
          [cat.name, cat.slug]
        );
        console.log(`✅ Added category: ${cat.name}`);
      }
    }

    // Get all category IDs
    const cats = await client.query('SELECT id, slug FROM categories');
    const catMap = {};
    cats.rows.forEach(c => { catMap[c.slug] = c.id; });

    // Enhanced products with detailed technical descriptions
    const products = [
      // === ĐIỆN THOẠI ===
      { 
        name: 'iPhone 15 Pro Max', 
        category: 'dien-thoai',
        price: 34990000, 
        original_price: 38990000, 
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80',
        stock: 50, 
        rating: 4.9, 
        reviews: 2341,
        description: `
          <h3 class="text-lg font-bold mb-3">Tổng quan</h3>
          <p class="mb-4">iPhone 15 Pro Max là chiếc iPhone mạnh mẽ nhất từ Apple với khung titanium cao cấp, chip A17 Pro đột phá và hệ thống camera Pro 48MP.</p>
          
          <h3 class="text-lg font-bold mb-3">Thông số kỹ thuật</h3>
          <ul class="list-disc pl-5 space-y-2 mb-4">
            <li><strong>Màn hình:</strong> Super Retina XDR 6.7", độ phân giải 2796×1290, ProMotion 120Hz, Always-On Display</li>
            <li><strong>Chip xử lý:</strong> Apple A17 Pro 3nm, CPU 6 nhân, GPU 6 nhân, Neural Engine 16 nhân</li>
            <li><strong>RAM:</strong> 8GB</li>
            <li><strong>Bộ nhớ:</strong> 256GB / 512GB / 1TB NVMe</li>
            <li><strong>Camera sau:</strong> 
              <ul class="list-circle pl-5 mt-1">
                <li>Chính 48MP, khẩu độ ƒ/1.78, chống rung quang học sensor-shift</li>
                <li>Telephoto 12MP 5x, khẩu độ ƒ/2.8, chống rung quang học</li>
                <li>Ultra Wide 12MP, khẩu độ ƒ/2.2, góc 120°</li>
              </ul>
            </li>
            <li><strong>Camera trước:</strong> 12MP TrueDepth, khẩu độ ƒ/1.9, autofocus</li>
            <li><strong>Quay video:</strong> 4K 60fps ProRes, LOG encoding, Action mode</li>
            <li><strong>Pin:</strong> 4422mAh, sạc nhanh 27W, MagSafe 15W, Qi wireless</li>
            <li><strong>Khung:</strong> Titanium Grade 5, mặt lưng kính Ceramic Shield</li>
            <li><strong>Kết nối:</strong> 5G, Wi-Fi 6E, Bluetooth 5.3, USB-C 3.0 (10Gbps)</li>
            <li><strong>Chống nước:</strong> IP68 (sâu 6m trong 30 phút)</li>
          </ul>

          <h3 class="text-lg font-bold mb-3">Tính năng nổi bật</h3>
          <ul class="list-disc pl-5 space-y-2">
            <li>Action Button tùy chỉnh thay thế nút静音</li>
            <li>Dynamic Island với Live Activities</li>
            <li>Face ID thế hệ mới</li>
            <li>Apple Pay, MagSafe ecosystem</li>
            <li>iOS 17 với StandBy mode, NameDrop</li>
          </ul>
        `
      },
      { 
        name: 'Samsung Galaxy S24 Ultra', 
        category: 'dien-thoai',
        price: 29990000, 
        original_price: 33990000, 
        image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80',
        stock: 35, 
        rating: 4.8, 
        reviews: 1876,
        description: `
          <h3 class="text-lg font-bold mb-3">Tổng quan</h3>
          <p class="mb-4">Galaxy S24 Ultra mang đến trải nghiệm AI đột phá với Galaxy AI, camera 200MP và bút S Pen tích hợp trong khung titanium bền bỉ.</p>
          
          <h3 class="text-lg font-bold mb-3">Thông số kỹ thuật</h3>
          <ul class="list-disc pl-5 space-y-2 mb-4">
            <li><strong>Màn hình:</strong> Dynamic AMOLED 2X 6.8", QHD+ 3120×1440, 120Hz adaptive, Gorilla Armor</li>
            <li><strong>Chip xử lý:</strong> Snapdragon 8 Gen 3 for Galaxy 4nm, CPU 8 nhân, GPU Adreno 750</li>
            <li><strong>RAM:</strong> 12GB LPDDR5X</li>
            <li><strong>Bộ nhớ:</strong> 256GB / 512GB / 1TB UFS 4.0</li>
            <li><strong>Camera sau:</strong> 
              <ul class="list-circle pl-5 mt-1">
                <li>Chính 200MP, ƒ/1.7, OIS, Laser AF</li>
                <li>Periscope Telephoto 50MP 5x, ƒ/3.4, OIS</li>
                <li>Telephoto 10MP 3x, ƒ/2.4, OIS</li>
                <li>Ultra Wide 12MP, ƒ/2.2, 120°</li>
              </ul>
            </li>
            <li><strong>Camera trước:</strong> 12MP, ƒ/2.2, Dual Pixel AF</li>
            <li><strong>Quay video:</strong> 8K 30fps, 4K 120fps, Super Steady OIS</li>
            <li><strong>Pin:</strong> 5000mAh, sạc nhanh 45W, wireless 15W, Wireless PowerShare</li>
            <li><strong>S Pen:</strong> Tích hợp, 4096 levels pressure, Bluetooth remote</li>
            <li><strong>Khung:</strong> Titanium, mặt lưng Gorilla Glass Victus 2</li>
            <li><strong>Kết nối:</strong> 5G, Wi-Fi 7, Bluetooth 5.3, USB-C 3.2</li>
          </ul>

          <h3 class="text-lg font-bold mb-3">Galaxy AI Features</h3>
          <ul class="list-disc pl-5 space-y-2">
            <li>Circle to Search - Khoanh tròn để tìm kiếm</li>
            <li>Live Translate - Dịch thoại thời gian thực</li>
            <li>Photo Assist - Chỉnh sửa ảnh bằng AI</li>
            <li>Note Assist - Tóm tắt ghi chú tự động</li>
          </ul>
        `
      },
      { 
        name: 'iPhone 15 Plus', 
        category: 'dien-thoai',
        price: 24990000, 
        original_price: 27990000, 
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80',
        stock: 40, 
        rating: 4.7, 
        reviews: 876,
        description: `
          <h3 class="text-lg font-bold mb-3">Tổng quan</h3>
          <p class="mb-4">iPhone 15 Plus với màn hình lớn 6.7", chip A16 Bionic mạnh mẽ và camera 48MP cho bức ảnh chi tiết tuyệt vời.</p>
          
          <h3 class="text-lg font-bold mb-3">Thông số kỹ thuật</h3>
          <ul class="list-disc pl-5 space-y-2 mb-4">
            <li><strong>Màn hình:</strong> Super Retina XDR 6.7", 2796×1290, 60Hz, Dynamic Island</li>
            <li><strong>Chip xử lý:</strong> Apple A16 Bionic 4nm, CPU 6 nhân, GPU 5 nhân</li>
            <li><strong>RAM:</strong> 6GB</li>
            <li><strong>Bộ nhớ:</strong> 128GB / 256GB / 512GB</li>
            <li><strong>Camera sau:</strong> 
              <ul class="list-circle pl-5 mt-1">
                <li>Chính 48MP, ƒ/1.6, OIS sensor-shift</li>
                <li>Ultra Wide 12MP, ƒ/2.4, 120°</li>
              </ul>
            </li>
            <li><strong>Camera trước:</strong> 12MP TrueDepth, ƒ/1.9</li>
            <li><strong>Quay video:</strong> 4K 60fps, Cinematic mode 4K 30fps</li>
            <li><strong>Pin:</strong> 4383mAh, sạc nhanh 20W, MagSafe 15W</li>
            <li><strong>Khung:</strong> Nhôm hàng không, mặt lưng kính màu</li>
            <li><strong>Kết nối:</strong> 5G, Wi-Fi 6, Bluetooth 5.3, USB-C 2.0</li>
          </ul>
        `
      },
      { 
        name: 'Google Pixel 8 Pro', 
        category: 'dien-thoai',
        price: 19990000, 
        original_price: 22990000, 
        image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80',
        stock: 15, 
        rating: 4.7, 
        reviews: 567,
        description: `
          <h3 class="text-lg font-bold mb-3">Tổng quan</h3>
          <p class="mb-4">Pixel 8 Pro mang đến trải nghiệm Android thuần khiết với AI Google tích hợp, camera computational photography hàng đầu.</p>
          
          <h3 class="text-lg font-bold mb-3">Thông số kỹ thuật</h3>
          <ul class="list-disc pl-5 space-y-2 mb-4">
            <li><strong>Màn hình:</strong> LTPO OLED 6.7", QHD+ 2992×1344, 120Hz, Gorilla Glass Victus 2</li>
            <li><strong>Chip xử lý:</strong> Google Tensor G3 4nm, Titan M2 security</li>
            <li><strong>RAM:</strong> 12GB LPDDR5X</li>
            <li><strong>Bộ nhớ:</strong> 128GB / 256GB / 512GB UFS 3.1</li>
            <li><strong>Camera sau:</strong> 
              <ul class="list-circle pl-5 mt-1">
                <li>Chính 50MP, ƒ/1.68, OIS, Laser AF</li>
                <li>Telephoto 48MP 5x, ƒ/2.8, OIS</li>
                <li>Ultra Wide 48MP, ƒ/1.95, 125.5°</li>
              </ul>
            </li>
            <li><strong>Camera trước:</strong> 10.5MP, ƒ/2.2</li>
            <li><strong>Quay video:</strong> 4K 60fps, Video Boost, Night Sight Video</li>
            <li><strong>Pin:</strong> 5050mAh, sạc nhanh 30W, wireless 23W</li>
            <li><strong>Cảm biến:</strong> Nhiệt độ, vân tay trong màn hình</li>
          </ul>

          <h3 class="text-lg font-bold mb-3">AI Features</h3>
          <ul class="list-disc pl-5 space-y-2">
            <li>Magic Eraser, Best Take, Magic Editor</li>
            <li>Call Screen, Hold for Me</li>
            <li>7 năm cập nhật Android</li>
          </ul>
        `
      },
      
      // === LAPTOP ===
      { 
        name: 'MacBook Pro M3 14"', 
        category: 'laptop',
        price: 52990000, 
        original_price: 57990000, 
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
        stock: 20, 
        rating: 4.9, 
        reviews: 987,
        description: `
          <h3 class="text-lg font-bold mb-3">Tổng quan</h3>
          <p class="mb-4">MacBook Pro 14" với chip M3 Pro mang hiệu năng đột phá cho chuyên gia sáng tạo với màn hình Liquid Retina XDR tuyệt đẹp.</p>
          
          <h3 class="text-lg font-bold mb-3">Thông số kỹ thuật</h3>
          <ul class="list-disc pl-5 space-y-2 mb-4">
            <li><strong>Màn hình:</strong> Liquid Retina XDR 14.2", 3024×1964, 120Hz ProMotion, 1000 nits sustained, 1600 nits peak HDR</li>
            <li><strong>Chip xử lý:</strong> Apple M3 Pro, CPU 12 nhân (6 performance + 6 efficiency), GPU 18 nhân, Neural Engine 16 nhân</li>
            <li><strong>RAM:</strong> 18GB Unified Memory</li>
            <li><strong>SSD:</strong> 512GB PCIe 4.0</li>
            <li><strong>Đồ họa:</strong> GPU 18-core tích hợp, hardware-accelerated ray tracing</li>
            <li><strong>Cổng kết nối:</strong> 
              <ul class="list-circle pl-5 mt-1">
                <li>3x Thunderbolt 4 (USB-C 40Gbps)</li>
                <li>HDMI 2.1 (support 8K 60Hz)</li>
                <li>SDXC card slot (UHS-II)</li>
                <li>MagSafe 3</li>
                <li>Jack 3.5mm headphone</li>
              </ul>
            </li>
            <li><strong>Kết nối không dây:</strong> Wi-Fi 6E (802.11ax), Bluetooth 5.3</li>
            <li><strong>Pin:</strong> 70Wh, lên đến 22 giờ video playback, sạc nhanh 50% trong 30 phút</li>
            <li>Camera: 1080p FaceTime HD với ISP tiên tiến</li>
            <li>Âm thanh: 6 speakers với force-cancelling woofers, Spatial Audio</li>
            <li>Cân nặng: 1.61 kg</li>
          </ul>

          <h3 class="text-lg font-bold mb-3">Phần mềm</h3>
          <ul class="list-disc pl-5 space-y-2">
            <li>macOS Sonoma với Stage Manager</li>
            <li>Final Cut Pro, Logic Pro optimized</li>
            <li>Universal Control, AirDrop, Continuity</li>
          </ul>
        `
      },
      { 
        name: 'MacBook Air M2', 
        category: 'laptop',
        price: 27990000, 
        original_price: 31990000, 
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
        stock: 35, 
        rating: 4.8, 
        reviews: 1234,
        description: `
          <h3 class="text-lg font-bold mb-3">Tổng quan</h3>
          <p class="mb-4">MacBook Air M2 siêu mỏng nhẹ với thiết kế mới, màn hình Liquid Retina 13.6" và hiệu năng đột phá từ chip M2.</p>
          
          <h3 class="text-lg font-bold mb-3">Thông số kỹ thuật</h3>
          <ul class="list-disc pl-5 space-y-2 mb-4">
            <li><strong>Màn hình:</strong> Liquid Retina 13.6", 2560×1664, 500 nits, P3 wide color</li>
            <li><strong>Chip xử lý:</strong> Apple M2 5nm, CPU 8 nhân, GPU 10 nhân, Neural Engine 16 nhân</li>
            <li><strong>RAM:</strong> 8GB / 16GB / 24GB Unified Memory</li>
            <li><strong>SSD:</strong> 256GB / 512GB / 1TB / 2TB</li>
            <li><strong>Cổng kết nối:</strong> 
              <ul class="list-circle pl-5 mt-1">
                <li>2x Thunderbolt / USB 4 (60Gbps)</li>
                <li>MagSafe 3</li>
                <li>Jack 3.5mm headphone</li>
              </ul>
            </li>
            <li><strong>Kết nối không dây:</strong> Wi-Fi 6 (802.11ax), Bluetooth 5.0</li>
            <li><strong>Pin:</strong> 52.6Wh, lên đến 18 giờ video playback</li>
            <li>Camera: 1080p FaceTime HD</li>
            <li>Âm thanh: 4 speakers với Spatial Audio</li>
            <li>Cân nặng: 1.24 kg</li>
            <li>Độ dày: 11.3mm</li>
          </ul>
        `
      },
      { 
        name: 'Dell XPS 15 OLED', 
        category: 'laptop',
        price: 48990000, 
        original_price: 54990000, 
        image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80',
        stock: 15, 
        rating: 4.7, 
        reviews: 654,
        description: `
          <h3 class="text-lg font-bold mb-3">Tổng quan</h3>
          <p class="mb-4">Dell XPS 15 OLED với màn hình 3.5K OLED stunning, Intel Core i9 thế hệ 13 và RTX 4060 cho hiệu năng sáng tạo đỉnh cao.</p>
          
          <h3 class="text-lg font-bold mb-3">Thông số kỹ thuật</h3>
          <ul class="list-disc pl-5 space-y-2 mb-4">
            <li><strong>Màn hình:</strong> 15.6" OLED 3.5K (3456×2160), 400 nits, 100% DCI-P3, Touch, Gorilla Glass 6</li>
            <li><strong>Chip xử lý:</strong> Intel Core i9-13900H (14 cores, 20 threads, up to 5.4GHz)</li>
            <li><strong>RAM:</strong> 32GB DDR5 4800MHz</li>
            <li><strong>SSD:</strong> 1TB PCIe NVMe Gen 4</li>
            <li><strong>Đồ họa:</strong> NVIDIA GeForce RTX 4060 8GB GDDR6 + Intel Iris Xe</li>
            <li><strong>Cổng kết nối:</strong> 
              <ul class="list-circle pl-5 mt-1">
                <li>2x Thunderbolt 4 (USB-C)</li>
                <li>1x USB-C 3.2</li>
                <li>SD card reader (UHS-III)</li>
                <li>Jack 3.5mm headphone/mic</li>
              </ul>
            </li>
            <li><strong>Kết nối không dây:</strong> Killer Wi-Fi 6E AX1675, Bluetooth 5.3</li>
            <li><strong>Pin:</strong> 86Wh, sạc nhanh 130W</li>
            <li>Camera: 720p HD IR với Windows Hello</li>
            <li>Bảo mật: Vân tay trong nguồn, TPM 2.0</li>
            <li>Cân nặng: 2.0 kg</li>
          </ul>
        `
      },
      { 
        name: 'Asus ROG Zephyrus G14', 
        category: 'laptop',
        price: 35990000, 
        original_price: 39990000, 
        image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80',
        stock: 18, 
        rating: 4.7, 
        reviews: 432,
        description: `
          <h3 class="text-lg font-bold mb-3">Tổng quan</h3>
          <p class="mb-4">ROG Zephyrus G14 - Gaming laptop 14" mạnh mẽ nhất với AMD Ryzen 9, RTX 4060 và màn hình Nebula 165Hz.</p>
          
          <h3 class="text-lg font-bold mb-3">Thông số kỹ thuật</h3>
          <ul class="list-disc pl-5 space-y-2 mb-4">
            <li><strong>Màn hình:</strong> 14" QHD+ (2560×1600) Nebula, 165Hz, 3ms, 500 nits, 100% DCI-P3, Pantone Validated</li>
            <li><strong>Chip xử lý:</strong> AMD Ryzen 9 7940HS (8 cores, 16 threads, up to 5.2GHz)</li>
            <li><strong>RAM:</strong> 16GB DDR5 4800MHz (onboard)</li>
            <li><strong>SSD:</strong> 512GB PCIe 4.0 NVMe (expandable)</li>
            <li><strong>Đồ họa:</strong> NVIDIA GeForce RTX 4060 8GB GDDR6, MUX Switch, Advanced Optimus</li>
            <li><strong>Cổng kết nối:</strong> 
              <ul class="list-circle pl-5 mt-1">
                <li>USB-C 3.2 Gen 2 với DisplayPort</li>
                <li>USB-C 3.2 Gen 2</li>
                <li>2x USB-A 3.2</li>
                <li>HDMI 2.1 FRL</li>
                <li>MicroSD card reader</li>
              </ul>
            </li>
            <li><strong>Kết nối không dây:</strong> Wi-Fi 6E, Bluetooth 5.3</li>
            <li><strong>Pin:</strong> 76Wh, sạc nhanh 240W</li>
            <li>Âm thanh: Dolby Atmos, Smart Amp, AI noise cancellation</li>
            <li>Cân nặng: 1.72 kg</li>
          </ul>

          <h3 class="text-lg font-bold mb-3">Gaming Features</h3>
          <ul class="list-disc pl-5 space-y-2">
            <li>ROG Intelligent Cooling với liquid metal</li>
            <li>AniMe Matrix LED (tùy chọn)</li>
            <li>Armoury Crate software</li>
          </ul>
        `
      },
      
      // === MÁY TÍNH BẢNG ===
      { 
        name: 'iPad Pro M2 11"', 
        category: 'may-tinh-bang',
        price: 22990000, 
        original_price: 25990000, 
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
        stock: 30, 
        rating: 4.8, 
        reviews: 876,
        description: `
          <h3 class="text-lg font-bold mb-3">Tổng quan</h3>
          <p class="mb-4">iPad Pro 11" với chip M2 mạnh mẽ, màn hình Liquid Retina ProMotion và hỗ trợ Apple Pencil 2 cho sáng tạo không giới hạn.</p>
          
          <h3 class="text-lg font-bold mb-3">Thông số kỹ thuật</h3>
          <ul class="list-disc pl-5 space-y-2 mb-4">
            <li><strong>Màn hình:</strong> Liquid Retina 11", 2388×1668, ProMotion 120Hz, 600 nits, P3 wide color</li>
            <li><strong>Chip xử lý:</strong> Apple M2, CPU 8 nhân, GPU 10 nhân, Neural Engine 16 nhân</li>
            <li><strong>RAM:</strong> 8GB / 16GB (1TB/2TB models)</li>
            <li><strong>Bộ nhớ:</strong> 128GB / 256GB / 512GB / 1TB / 2TB</li>
            <li><strong>Camera sau:</strong> 
              <ul class="list-circle pl-5 mt-1">
                <li>Chính 12MP Wide, ƒ/1.8</li>
                <li>Ultra Wide 10MP, ƒ/2.4, 125°</li>
                <li>LiDAR Scanner</li>
              </ul>
            </li>
            <li><strong>Camera trước:</strong> 12MP Ultra Wide, Center Stage</li>
            <li><strong>Quay video:</strong> 4K 60fps, ProRes, ProRAW</li>
            <li><strong>Kết nối:</strong> Wi-Fi 6E, Bluetooth 5.3, USB-C Thunderbolt / USB 4</li>
            <li><strong>Pin:</strong> Lên đến 10 giờ surfing web</li>
            <li>Phụ kiện: Apple Pencil 2, Magic Keyboard (bán riêng)</li>
            <li>Cân nặng: 466g (Wi-Fi)</li>
          </ul>
        `
      },
      { 
        name: 'Samsung Galaxy Tab S9', 
        category: 'may-tinh-bang',
        price: 18990000, 
        original_price: 21990000, 
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
        stock: 25, 
        rating: 4.6, 
        reviews: 432,
        description: `
          <h3 class="text-lg font-bold mb-3">Tổng quan</h3>
          <p class="mb-4">Galaxy Tab S9 với màn hình Dynamic AMOLED 2X, S Pen tích hợp và khả năng chống nước IP68.</p>
          
          <h3 class="text-lg font-bold mb-3">Thông số kỹ thuật</h3>
          <ul class="list-disc pl-5 space-y-2 mb-4">
            <li><strong>Màn hình:</strong> Dynamic AMOLED 2X 11", 2560×1600, 120Hz, 420 nits</li>
            <li><strong>Chip xử lý:</strong> Snapdragon 8 Gen 2 for Galaxy</li>
            <li><strong>RAM:</strong> 8GB / 12GB</li>
            <li><strong>Bộ nhớ:</strong> 128GB / 256GB / 512GB (expandable microSD)</li>
            <li><strong>Camera sau:</strong> 13MP AF + 8MP Ultra Wide</li>
            <li><strong>Camera trước:</strong> 12MP Ultra Wide</li>
            <li><strong>Quay video:</strong> 4K 30fps</li>
            <li><strong>S Pen:</strong> Included, 4096 levels, Bluetooth remote</li>
            <li><strong>Kết nối:</strong> Wi-Fi 6E, Bluetooth 5.3, USB-C 3.2</li>
            <li><strong>Pin:</strong> 8400mAh, sạc nhanh 45W</li>
            <li><strong>Chống nước:</strong> IP68</li>
            <li>Cân nặng: 498g</li>
          </ul>
        `
      },
      
      // === TAI NGHE ===
      { 
        name: 'AirPods Pro 2nd Gen', 
        category: 'tai-nghe',
        price: 6990000, 
        original_price: 7990000, 
        image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&q=80',
        stock: 100, 
        rating: 4.8, 
        reviews: 4521,
        description: `
          <h3 class="text-lg font-bold mb-3">Tổng quan</h3>
          <p class="mb-4">AirPods Pro thế hệ 2 với chip H2, ANC chủ động gấp 2 lần và âm thanh không gian cá nhân hóa.</p>
          
          <h3 class="text-lg font-bold mb-3">Thông số kỹ thuật</h3>
          <ul class="list-disc pl-5 space-y-2 mb-4">
            <li><strong>Chip:</strong> Apple H2 custom driver và amplifier</li>
            <li><strong>ANC:</strong> Active Noise Cancellation gấp 2 lần thế hệ 1</li>
            <li><strong>Transparency mode:</strong> Adaptive Transparency</li>
            <li><strong>Driver:</strong> Custom high-excursion driver</li>
            <li><strong>Microphone:</strong> Dual beamforming mics, Inward-facing mic</li>
            <li><strong>Cảm biến:</strong> Skin-detect sensor, Motion-detecting accelerometer, Speech-detecting accelerometer, Force sensor</li>
            <li><strong>Pin:</strong> 
              <ul class="list-circle pl-5 mt-1">
                <li>Earbuds: 6 giờ (ANC on), 30 giờ với case</li>
                <li>Case: MagSafe, Qi wireless, Lightning, Speaker for Find My</li>
              </ul>
            </li>
            <li><strong>Kết nối:</strong> Bluetooth 5.3</li>
            <li><strong>Chống nước:</strong> IPX4 (earbuds và case)</li>
            <li><strong>Tương thích:</strong> iPhone, iPad, Mac, Apple Watch, Apple TV</li>
            <li>Cân nặng: 5.3g mỗi earbud, 50.8g case</li>
          </ul>

          <h3 class="text-lg font-bold mb-3">Tính năng</h3>
          <ul class="list-disc pl-5 space-y-2">
            <li>Personalized Spatial Audio với dynamic head tracking</li>
            <li>Adaptive EQ</li>
            <li>Conversation Awareness</li>
            <li>Find My với Precision Finding</li>
          </ul>
        `
      },
      { 
        name: 'Sony WH-1000XM5', 
        category: 'tai-nghe',
        price: 8490000, 
        original_price: 9990000, 
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
        stock: 45, 
        rating: 4.9, 
        reviews: 3210,
        description: `
          <h3 class="text-lg font-bold mb-3">Tổng quan</h3>
          <p class="mb-4">WH-1000XM5 - Tai nghe chống ồn hàng đầu với 8 microphones, chip V1 và 30 giờ pin.</p>
          
          <h3 class="text-lg font-bold mb-3">Thông số kỹ thuật</h3>
          <ul class="list-disc pl-5 space-y-2 mb-4">
            <li><strong>Driver:</strong> 30mm carbon fiber composite</li>
            <li><strong>ANC:</strong> Dual Noise Sensor technology với 8 microphones</li>
            <li><strong>Chip:</strong> Integrated Processor V1</li>
            <li><strong>Codec:</strong> LDAC, AAC, SBC</li>
            <li><strong>Pin:</strong> 30 giờ (ANC on), 40 giờ (ANC off), sạc nhanh 3 phút = 3 giờ</li>
            <li><strong>Kết nối:</strong> Bluetooth 5.2, Multipoint connection</li>
            <li><strong>Cổng:</strong> USB-C, 3.5mm jack</li>
            <li><strong>Cảm biến:</strong> Proximity sensor, Accelerometer</li>
            <li><strong>Tương thích:</strong> Sony Headphones Connect app</li>
            <li>Cân nặng: 250g</li>
          </ul>

          <h3 class="text-lg font-bold mb-3">Tính năng</h3>
          <ul class="list-disc pl-5 space-y-2">
            <li>Adaptive Sound Control tự động điều chỉnh</li>
            <li>Speak-to-Chat tự động pause</li>
            <li>360 Reality Audio</li>
            <li>DSEE Extreme upscaling</li>
            <li>Quick Attention mode</li>
          </ul>
        `
      },
      
      // === ĐỒNG HỒ THÔNG MINH ===
      { 
        name: 'Apple Watch Series 9', 
        category: 'dong-ho-thong-minh',
        price: 12990000, 
        original_price: 14990000, 
        image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&q=80',
        stock: 60, 
        rating: 4.7, 
        reviews: 1543,
        description: `
          <h3 class="text-lg font-bold mb-3">Tổng quan</h3>
          <p class="mb-4">Apple Watch Series 9 với chip S9 SiP, Double Tap gesture và màn hình sáng gấp 2 lần.</p>
          
          <h3 class="text-lg font-bold mb-3">Thông số kỹ thuật</h3>
          <ul class="list-disc pl-5 space-y-2 mb-4">
            <li><strong>Màn hình:</strong> Always-On Retina LTPO OLED, 1000 nits (2000 nits peak), 41mm hoặc 45mm</li>
            <li><strong>Chip:</strong> Apple S9 SiP với 64-bit dual-core, W3 wireless chip, Ultra Wideband 2</li>
            <li><strong>Bộ nhớ:</strong> 64GB</li>
            <li><strong>Cảm biến:</strong> 
              <ul class="list-circle pl-5 mt-1">
                <li>Blood Oxygen sensor</li>
                <li>ECG app</li>
                <li>Heart rate sensor (thế hệ 3)</li>
                <li>Accelerometer (256g)</li>
                <li>Gyroscope</li>
                <li>Ambient light sensor</li>
                <li>Temperature sensing</li>
              </ul>
            </li>
            <li><strong>GPS:</strong> GPS/GNSS, Compass, Always-on altimeter</li>
            <li><strong>Kết nối:</strong> Wi-Fi 4 (802.11n), Bluetooth 5.3, NFC (Apple Pay), Ultra Wideband 2</li>
            <li><strong>Pin:</strong> 18 giờ, sạc nhanh 0-80% trong 45 phút</li>
            <li><strong>Chống nước:</strong> 50m (5ATM), IP6X dust resistant</li>
            <li>Chất liệu: Nhôm, Thép không gỉ, hoặc Titanium</li>
          </ul>

          <h3 class="text-lg font-bold mb-3">Health Features</h3>
          <ul class="list-disc pl-5 space-y-2">
            <li>Sleep tracking với sleep stages</li>
            <li>Temperature sensing cho ovulation tracking</li>
            <li>Crash Detection, Fall Detection</li>
            <li>Emergency SOS</li>
          </ul>
        `
      },
      { 
        name: 'Samsung Galaxy Watch6 Classic', 
        category: 'dong-ho-thong-minh',
        price: 9990000, 
        original_price: 11990000, 
        image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&q=80',
        stock: 30, 
        rating: 4.6, 
        reviews: 432,
        description: `
          <h3 class="text-lg font-bold mb-3">Tổng quan</h3>
          <p class="mb-4">Galaxy Watch6 Classic với viền xoay đặc trưng, Wear OS 4 và cảm biến BioActive toàn diện.</p>
          
          <h3 class="text-lg font-bold mb-3">Thông số kỹ thuật</h3>
          <ul class="list-disc pl-5 space-y-2 mb-4">
            <li><strong>Màn hình:</strong> Super AMOLED 1.5" (47mm) hoặc 1.3" (43mm), Sapphire Crystal</li>
            <li><strong>Chip:</strong> Exynos W930 Dual-core 1.4GHz</li>
            <li><strong>RAM:</strong> 2GB</li>
            <li><strong>Bộ nhớ:</strong> 16GB</li>
            <li><strong>Cảm biến:</strong> Samsung BioActive (Optical HR + Electrical HR + Bioelectrical Impedance), Accelerometer, Barometer, Gyro, Geomagnetic, Light</li>
            <li><strong>GPS:</strong> GPS/Glonass/Beidou/Galileo</li>
            <li><strong>Kết nối:</strong> Wi-Fi 802.11 a/b/g/n 2.4+5GHz, Bluetooth 5.3, NFC, LTE (optional)</li>
            <li><strong>Pin:</strong> 425mAh (47mm) / 300mAh (43mm), sạc wireless</li>
            <li><strong>Chống nước:</strong> 5ATM + IP68, MIL-STD-810H</li>
            <li>Hệ điều hành: Wear OS Powered by Samsung</li>
            <li>Viền: Rotating bezel đặc trưng</li>
          </ul>
        `
      },
      
      // === GAMING ===
      { 
        name: 'PlayStation 5 Slim', 
        category: 'thiet-bi-gaming',
        price: 13990000, 
        original_price: 15990000, 
        image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&q=80',
        stock: 25, 
        rating: 4.9, 
        reviews: 2341,
        description: `
          <h3 class="text-lg font-bold mb-3">Tổng quan</h3>
          <p class="mb-4">PS5 Slim với thiết kế mới nhỏ gọn hơn 30%, SSD 1TB và trải nghiệm gaming thế hệ mới.</p>
          
          <h3 class="text-lg font-bold mb-3">Thông số kỹ thuật</h3>
          <ul class="list-disc pl-5 space-y-2 mb-4">
            <li><strong>CPU:</strong> AMD Zen 2, 8 cores, 16 threads, up to 4.0GHz</li>
            <li><strong>GPU:</strong> AMD RDNA 2, 36 CUs, 2.23GHz, 10.28 TFLOPS</li>
            <li><strong>RAM:</strong> 16GB GDDR6, 448GB/s bandwidth</li>
            <li><strong>SSD:</strong> 1TB Custom NVMe, 5.5GB/s raw throughput</li>
            <li><strong>Optical Drive:</strong> 4K UHD Blu-ray</li>
            <li><strong>Video Output:</strong> HDMI 2.1, support 4K 120Hz, 8K, VRR, ALLM</li>
            <li><strong>Âm thanh:</strong> Tempest 3D AudioTech</li>
            <li><strong>Cổng kết nối:</strong> 
              <ul class="list-circle pl-5 mt-1">
                <li>USB Type-A (Hi-Speed USB)</li>
                <li>USB Type-A (SuperSpeed USB 10Gbps) x2</li>
                <li>USB Type-C (SuperSpeed USB 10Gbps)</li>
                <li>Ethernet (10BASE-T, 100BASE-TX, 1000BASE-T)</li>
              </ul>
            </li>
            <li><strong>Kết nối:</strong> Wi-Fi 6 (802.11ax), Bluetooth 5.1</li>
            <li><strong>Dimensions:</strong> 358mm x 96mm x 216mm</li>
            <li>Cân nặng: 3.2kg (Disc Edition)</li>
          </ul>

          <h3 class="text-lg font-bold mb-3">DualSense Controller</h3>
          <ul class="list-disc pl-5 space-y-2">
            <li>Haptic feedback thay thế rumble</li>
            <li>Adaptive triggers với lực kháng</li>
            <li>Built-in microphone, Create button</li>
            <li>Motion sensing với accelerometer và gyroscope</li>
          </ul>
        `
      },
      { 
        name: 'Xbox Series X', 
        category: 'thiet-bi-gaming',
        price: 12990000, 
        original_price: 14990000, 
        image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&q=80',
        stock: 20, 
        rating: 4.8, 
        reviews: 1876,
        description: `
          <h3 class="text-lg font-bold mb-3">Tổng quan</h3>
          <p class="mb-4">Xbox Series X - Console mạnh mẽ nhất với 12 TFLOPS, Quick Resume và Game Pass library khổng lồ.</p>
          
          <h3 class="text-lg font-bold mb-3">Thông số kỹ thuật</h3>
          <ul class="list-disc pl-5 space-y-2 mb-4">
            <li><strong>CPU:</strong> AMD Zen 2, 8 cores, 16 threads, 3.8GHz (3.6GHz với SMT)</li>
            <li><strong>GPU:</strong> AMD RDNA 2, 52 CUs, 1.825GHz, 12.15 TFLOPS</li>
            <li><strong>RAM:</strong> 16GB GDDR6 (10GB @ 560GB/s, 6GB @ 336GB/s)</li>
            <li><strong>SSD:</strong> 1TB Custom NVMe (2.4GB/s raw, 4.8GB/s compressed)</li>
            <li><strong>Optical Drive:</strong> 4K UHD Blu-ray</li>
            <li><strong>Video Output:</strong> HDMI 2.1, support 4K 120Hz, 8K, VRR, ALLM, HDR</li>
            <li><strong>Âm thanh:</strong> Dolby Atmos, DTS:X, Windows Sonic</li>
            <li><strong>Cổng kết nối:</strong> 
              <ul class="list-circle pl-5 mt-1">
                <li>3x USB 3.1 Gen 1</li>
                <li>HDMI 2.1 Out</li>
                <li>Ethernet (802.3az)</li>
                <li>Storage Expansion Slot</li>
              </ul>
            </li>
            <li><strong>Kết nối:</strong> Wi-Fi 5 (802.11ac), Bluetooth 5.1</li>
            <li>Dimensions: 151mm x 151mm x 301mm</li>
            <li>Cân nặng: 4.45kg</li>
          </ul>

          <h3 class="text-lg font-bold mb-3">Features</h3>
          <ul class="list-disc pl-5 space-y-2">
            <li>Quick Resume - Chuyển đổi giữa nhiều game</li>
            <li>Smart Delivery - Tự động upgrade version</li>
            <li>Xbox Game Pass - 100+ games library</li>
            <li>Auto HDR cho game cũ</li>
          </ul>
        `
      },
      { 
        name: 'Nintendo Switch OLED', 
        category: 'thiet-bi-gaming',
        price: 8490000, 
        original_price: 9490000, 
        image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600&q=80',
        stock: 40, 
        rating: 4.7, 
        reviews: 1543,
        description: `
          <h3 class="text-lg font-bold mb-3">Tổng quan</h3>
          <p class="mb-4">Switch OLED với màn hình 7" OLED rực rỡ, 64GB storage và dock mới với Ethernet port.</p>
          
          <h3 class="text-lg font-bold mb-3">Thông số kỹ thuật</h3>
          <ul class="list-disc pl-5 space-y-2 mb-4">
            <li><strong>Màn hình:</strong> 7" OLED capacitive touchscreen, 1280×720</li>
            <li><strong>Chip:</strong> NVIDIA Custom Tegra processor</li>
            <li><strong>Bộ nhớ:</strong> 64GB internal (expandable microSD up to 2TB)</li>
            <li><strong>RAM:</strong> 4GB LPDDR4X</li>
            <li><strong>Pin:</strong> 4310mAh, 4.5-9 hours tùy game</li>
            <li><strong>Kết nối:</strong> Wi-Fi 5 (802.11ac), Bluetooth 4.1</li>
            <li><strong>Video Output:</strong> 1920×1080 60fps qua dock (TV mode)</li>
            <li><strong>Âm thanh:</strong> 5.1ch Linear PCM output via HDMI</li>
            <li><strong>Cổng:</strong> USB-C (charging/dock), 3.5mm audio jack, microSD slot</li>
            <li>Joy-Con: HD Rumble, IR Motion Camera, NFC (Amiibo)</li>
            <li>Cân nặng: 320g (console only)</li>
          </ul>

          <h3 class="text-lg font-bold mb-3">Chế độ chơi</h3>
          <ul class="list-disc pl-5 space-y-2">
            <li>TV Mode - Chơi trên TV qua dock</li>
            <li>Tabletop Mode - Đặt đứng với kickstand</li>
            <li>Handheld Mode - Chơi cầm tay</li>
          </ul>
        `
      },
      
      // === MÁY ẢNH ===
      { 
        name: 'Sony A7 IV', 
        category: 'may-anh',
        price: 59990000, 
        original_price: 64990000, 
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80',
        stock: 8, 
        rating: 4.9, 
        reviews: 432,
        description: `
          <h3 class="text-lg font-bold mb-3">Tổng quan</h3>
          <p class="mb-4">Sony A7 IV - Hybrid camera 33MP full-frame với autofocus 759 điểm và quay video 4K 60fps.</p>
          
          <h3 class="text-lg font-bold mb-3">Thông số kỹ thuật</h3>
          <ul class="list-disc pl-5 space-y-2 mb-4">
            <li><strong>Cảm biến:</strong> 33MP Full-Frame Exmor R BSI CMOS</li>
            <li><strong>Chip xử lý:</strong> BIONZ XR (8x faster)</li>
            <li><strong>ISO:</strong> 100-51200 (expandable 50-204800)</li>
            <li><strong>Autofocus:</strong> 759 điểm phase-detection, Real-time Eye AF (Human/Animal/Bird), Real-time Tracking</li>
            <li><strong>Continuous Shooting:</strong> 10fps với AF/AE tracking</li>
            <li><strong>Quay video:</strong> 
              <ul class="list-circle pl-5 mt-1">
                <li>4K 60fps 10-bit 4:2:2</li>
                <li>S-Log3, S-Cinetone</li>
                <li>Active Mode stabilization</li>
                <li>Breathing Compensation</li>
              </ul>
            </li>
            <li><strong>IBIS:</strong> 5-axis in-body stabilization, 5.5 stops</li>
            <li><strong>Màn hình:</strong> 3.0" vari-angle touchscreen LCD, 1.03M dots</li>
            <li><strong>Kính ngắm:</strong> 0.5" OLED EVF, 3.69M dots, 0.78x magnification, 120fps refresh</li>
            <li><strong>Lưu trữ:</strong> Dual card slots (CFexpress Type A / SD UHS-II)</li>
            <li><strong>Kết nối:</strong> Wi-Fi 5GHz/2.4GHz, Bluetooth 5.0, USB-C 3.2, Micro HDMI, 3.5mm mic/headphone</li>
            <li><strong>Pin:</strong> NP-FZ100, 520-580 shots</li>
            <li>Cân nặng: 658g (body only)</li>
          </ul>
        `
      },
      { 
        name: 'Canon EOS R6 Mark II', 
        category: 'may-anh',
        price: 54990000, 
        original_price: 59990000, 
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80',
        stock: 10, 
        rating: 4.8, 
        reviews: 321,
        description: `
          <h3 class="text-lg font-bold mb-3">Tổng quan</h3>
          <p class="mb-4">Canon EOS R6 Mark II - Mirrorless 24MP full-frame với continuous shooting 40fps và IBIS 8 stops.</p>
          
          <h3 class="text-lg font-bold mb-3">Thông số kỹ thuật</h3>
          <ul class="list-disc pl-5 space-y-2 mb-4">
            <li><strong>Cảm biến:</strong> 24.2MP Full-Frame CMOS</li>
            <li><strong>Chip xử lý:</strong> DIGIC X</li>
            <li><strong>ISO:</strong> 100-102400 (expandable 204800)</li>
            <li><strong>Autofocus:</strong> Dual Pixel CMOS AF II, 1053 zones, Eye/Head/Body Detection</li>
            <li><strong>Continuous Shooting:</strong> 40fps electronic, 12fps mechanical</li>
            <li><strong>Quay video:</strong> 
              <ul class="list-circle pl-5 mt-1">
                <li>4K 60fps oversampled from 6K</li>
                <li>6K RAW output via HDMI</li>
                <li>Canon Log 3</li>
              </ul>
            </li>
            <li><strong>IBIS:</strong> 5-axis, up to 8 stops compensation</li>
            <li><strong>Màn hình:</strong> 3.0" vari-angle touchscreen, 1.62M dots</li>
            <li><strong>Kính ngắm:</strong> 0.5" OLED EVF, 3.69M dots, 120fps refresh</li>
            <li><strong>Lưu trữ:</strong> Dual SD card slots (UHS-II)</li>
            <li><strong>Kết nối:</strong> Wi-Fi 5GHz/2.4GHz, Bluetooth 5.0, USB-C 3.2, Micro HDMI, 3.5mm mic/headphone</li>
            <li><strong>Pin:</strong> LP-E6NH, 360-760 shots</li>
            <li>Cân nặng: 670g (body only)</li>
          </ul>
        `
      },
      
      // === LOA & ÂM THANH ===
      { 
        name: 'HomePod 2nd Gen', 
        category: 'loa-am-thanh',
        price: 7490000, 
        original_price: 8490000, 
        image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&q=80',
        stock: 30, 
        rating: 4.6, 
        reviews: 432,
        description: `
          <h3 class="text-lg font-bold mb-3">Tổng quan</h3>
          <p class="mb-4">HomePod thế hệ 2 với âm thanh không gian, cảm biến nhiệt độ và Siri thông minh hơn.</p>
          
          <h3 class="text-lg font-bold mb-3">Thông số kỹ thuật</h3>
          <ul class="list-disc pl-5 space-y-2 mb-4">
            <li><strong>Driver:</strong> High-excursion woofer, 5 tweeters với beamforming</li>
            <li><strong>Microphone:</strong> 4-mic array cho far-field Siri</li>
            <li><strong>Chip:</strong> Apple S7 SiP</li>
            <li><strong>Âm thanh:</strong> Spatial Audio với Dolby Atmos, Computational audio</li>
            <li><strong>Cảm biến:</strong> Temperature sensor, Humidity sensor, Touch control</li>
            <li><strong>Kết nối:</strong> Wi-Fi 6 (802.11ax), Bluetooth 5.0, Thread, Ultra Wideband chip</li>
            <li><strong>Smart Home:</strong> HomeKit hub, Matter support</li>
            <li>Dimensions: 168mm height x 142mm diameter</li>
            <li>Cân nặng: 2.3kg</li>
          </ul>

          <h3 class="text-lg font-bold mb-3">Tính năng</h3>
          <ul class="list-disc pl-5 space-y-2">
            <li>Room-aware audio tuning</li>
            <li>Siri voice recognition</li>
            <li>Intercom, Announcements</li>
            <li>Find My support</li>
          </ul>
        `
      },
      { 
        name: 'Sonos Era 300', 
        category: 'loa-am-thanh',
        price: 11990000, 
        original_price: 13990000, 
        image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&q=80',
        stock: 20, 
        rating: 4.7, 
        reviews: 321,
        description: `
          <h3 class="text-lg font-bold mb-3">Tổng quan</h3>
          <p class="mb-4">Sonos Era 300 - Smart speaker với Spatial Audio, Dolby Atmos và WiFi 6.</p>
          
          <h3 class="text-lg font-bold mb-3">Thông số kỹ thuật</h3>
          <ul class="list-disc pl-5 space-y-2 mb-4">
            <li><strong>Drivers:</strong> 
              <ul class="list-circle pl-5 mt-1">
                <li>6 tweeters (3 angled up, 2 side-firing, 1 forward-firing)</li>
                <li>1 mid-woofer</li>
              </ul>
            </li>
            <li><strong>Amplification:</strong> 6 Class-D digital amps</li>
            <li><strong>Microphone:</strong> 6-mic array với far-field</li>
            <li><strong>Âm thanh:</strong> Spatial Audio, Dolby Atmos</li>
            <li><strong>Kết nối:</strong> Wi-Fi 6 (802.11ax), Ethernet port, Bluetooth, AirPlay 2</li>
            <li><strong>Controls:</strong> Capacitive touch buttons, Voice control</li>
            <li><strong>Smart Home:</strong> Alexa built-in, Sonos Voice Control</li>
            <li>Dimensions: 185mm x 160mm x 136mm</li>
            <li>Cân nặng: 4.5kg</li>
          </ul>
        `
      },
      
      // === PHỤ KIỆN ===
      { 
        name: 'Sạc Anker 65W GaN', 
        category: 'phu-kien',
        price: 1190000, 
        original_price: 1490000, 
        image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&q=80',
        stock: 200, 
        rating: 4.7, 
        reviews: 1234,
        description: `
          <h3 class="text-lg font-bold mb-3">Tổng quan</h3>
          <p class="mb-4">Anker 65W GaNPrime với công nghệ GaN II nhỏ gọn, 3 cổng sạc và PowerIQ 4.0 thông minh.</p>
          
          <h3 class="text-lg font-bold mb-3">Thông số kỹ thuật</h3>
          <ul class="list-disc pl-5 space-y-2 mb-4">
            <li><strong>Tổng công suất:</strong> 65W Max</li>
            <li><strong>Cổng:</strong> 2x USB-C, 1x USB-A</li>
            <li><strong>USB-C1/C2:</strong> 5V⎓3A / 9V⎓3A / 15V⎓3A / 20V⎓3.25A (65W Max)</li>
            <li><strong>USB-A:</strong> 5V⎓3A / 9V⎓2A / 12V⎓1.5A (22.5W Max)</li>
            <li><strong>Power Distribution:</strong> 
              <ul class="list-circle pl-5 mt-1">
                <li>C1 alone: 65W Max</li>
                <li>C1 + C2: 45W + 20W</li>
                <li>C1 + A: 45W + 20W</li>
                <li>C1 + C2 + A: 45W + 10W + 10W</li>
              </ul>
            </li>
            <li><strong>Công nghệ:</strong> GaN II, PowerIQ 4.0, ActiveShield 2.0</li>
            <li><strong>Input:</strong> 100-240V ~ 1.8A 50-60Hz</li>
            <li><strong>Kích thước:</strong> 36 × 36 × 71mm</li>
            <li>Cân nặng: 112g</li>
          </ul>

          <h3 class="text-lg font-bold mb-3">Tương thích</h3>
          <ul class="list-disc pl-5 space-y-2">
            <li>MacBook Pro/Air, iPad Pro, iPhone 15 series</li>
            <li>Dell XPS, HP Spectre, Lenovo ThinkPad</li>
            <li>Samsung Galaxy, Google Pixel</li>
            <li>Nintendo Switch, Steam Deck</li>
          </ul>
        `
      },
      { 
        name: 'Chuột Logitech MX Master 3S', 
        category: 'phu-kien-may-tinh',
        price: 2490000, 
        original_price: 2990000, 
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80',
        stock: 80, 
        rating: 4.8, 
        reviews: 1543,
        description: `
          <h3 class="text-lg font-bold mb-3">Tổng quan</h3>
          <p class="mb-4">MX Master 3S với cảm biến 8K DPI, silent click và pin 70 ngày cho productivity tối đa.</p>
          
          <h3 class="text-lg font-bold mb-3">Thông số kỹ thuật</h3>
          <ul class="list-disc pl-5 space-y-2 mb-4">
            <li><strong>Cảm biến:</strong> Darkfield 8K DPI, tracking trên mọi bề mặt (kể cả kính)</li>
            <li><strong>Buttons:</strong> 7 programmable buttons</li>
            <li><strong>Scroll wheel:</strong> MagSpeed electromagnetic, 1000 lines/second</li>
            <li><strong>Kết nối:</strong> 
              <ul class="list-circle pl-5 mt-1">
                <li>Logi Bolt USB receiver</li>
                <li>Bluetooth Low Energy</li>
                <li>USB-C charging</li>
              </ul>
            </li>
            <li><strong>Pin:</strong> 500mAh Li-Po, 70 days full charge, 3 hours quick charge</li>
            <li><strong>Dimensions:</strong> 124.9 x 84.3 x 51mm</li>
            <li>Cân nặng: 141g</li>
          </ul>

          <h3 class="text-lg font-bold mb-3">Tính năng</h3>
          <ul class="list-disc pl-5 space-y-2">
            <li>Logi Options+ customization</li>
            <li>Flow cross-computer control</li>
            <li>App-specific customizations</li>
            <li>Silent clicks (90% noise reduction)</li>
          </ul>
        `
      },
    ];

    // Check existing products
    const existingProducts = await client.query('SELECT name FROM products');
    const existingNames = existingProducts.rows.map(r => r.name.toLowerCase());

    let added = 0;
    for (const p of products) {
      if (!existingNames.includes(p.name.toLowerCase()) && catMap[p.category]) {
        await client.query(
          `INSERT INTO products (name, description, price, original_price, image_url, category_id, stock, rating, review_count, is_featured) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [p.name, p.description, p.price, p.original_price, p.image, catMap[p.category], p.stock, p.rating, p.reviews, Math.random() > 0.7]
        );
        added++;
      }
    }
    
    console.log(`✅ Added ${added} new products with detailed descriptions`);
  } catch (err) {
    console.error('❌ Error seeding products:', err.message);
  } finally {
    client.release();
  }
}
