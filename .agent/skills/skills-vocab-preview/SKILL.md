---
name: vocab-preview
description: Tạo file HTML standalone, đẹp mắt và tương tác cao để xem trước toàn bộ từ vựng và 16 dạng bài tập trong thư mục Unit vocab (ví dụ data/gs6/unit-7/vocab).
---

# Vocab Preview Skill

## Vai trò & Mục đích

Skill này tự động tổng hợp toàn bộ dữ liệu từ vựng (`vocab.json`) và 16 dạng bài tập luyện tập (`exercises/*.json`) trong thư mục bài học (Unit vocab folder) thành một file HTML độc lập (**`preview.html`**).

File HTML được thiết kế với tiêu chuẩn giao diện hiện đại, thẩm mỹ cao (Rich Aesthetics), hỗ trợ cả hai chế độ:
1. 🎓 **Chế độ Luyện tập (Practice Mode)**: Dành cho học sinh làm bài trực tiếp, chấm điểm tự động, phản hồi tức thì.
2. 👨‍🏫 **Chế độ Giáo viên / Biên tập (Teacher / Review Mode)**: Tự động highlight toàn bộ đáp án đúng, hiển thị giải thích, từ loại, từ gốc để duyệt và nghiệm thu nội dung bài học nhanh chóng.

## Khi nào kích hoạt skill này

Kích hoạt skill này khi:
- Người dùng yêu cầu tạo file HTML xem trước từ vựng hoặc bài tập của một Unit (`"tạo html preview"`, `"tạo giao diện xem từ vựng"`, `"xem trước bài tập unit X"`).
- Người dùng cung cấp đường dẫn thư mục `vocab` (ví dụ `data/gs6/unit-7/vocab`) và muốn có file preview tương tác.
- Sau khi hoàn thành tạo bài tập (Skill `data-vocab-step-7-practice`), người dùng muốn kiểm tra kết quả trực quan trên trình duyệt.

## Dữ liệu đầu vào cần có

Thư mục mục tiêu (Target Directory) cần có:
- `vocab.json`: Danh sách từ vựng chia theo nhóm, phiên âm Anh - Anh / Anh - Mỹ, nghĩa tiếng Việt, câu ví dụ, đường dẫn ảnh/audio.
- `exercises/`: Thư mục con chứa các file bài tập JSON:
  - `01_multiple_choice_direct.json`
  - `02_multiple_choice_sentence.json`
  - `03_multiple_choice_conversation.json`
  - `04_pic_to_word.json`
  - `05_write_english_words.json`
  - `06_fill_in_blanks.json`
  - `07_paragraph_fill.json`
  - `08_sentence_ordering.json`
  - `09_multiple_choice_closest.json`
  - `10_multiple_choice_opposite.json`
  - `11_dictionary_entry.json`
  - `12_signs_and_notices.json`
  - `13_word_families_table.json`
  - `14_word_families_mcq.json`
  - `15_word_formation.json`
  - `16_translate_sentences.json`
- *(Tùy chọn)* `image-prompts.json`: Prompts mô tả tạo ảnh cho từ vựng.

## Cách chạy tạo Preview

Có 2 cách tạo file preview:

### Cách 1: Sử dụng Script PowerShell (Khuyên dùng trên Windows - Không cần cài đặt gì thêm)

Chạy câu lệnh PowerShell trong terminal:
```powershell
powershell -ExecutionPolicy Bypass -File .agent/skills/skills-vocab-preview/scripts/generate_preview.ps1 -VocabDir "data/gs6/unit-7/vocab"
```

Tùy chỉnh tên file xuất ra (mặc định là `preview.html` trong thư mục vocab):
```powershell
powershell -ExecutionPolicy Bypass -File .agent/skills/skills-vocab-preview/scripts/generate_preview.ps1 -VocabDir "data/gs6/unit-7/vocab" -OutputFile "data/gs6/unit-7/vocab/preview.html"
```

### Cách 2: Sử dụng Script Python (Dành cho môi trường có Python / đa nền tảng)

```bash
python .agent/skills/skills-vocab-preview/scripts/generate_preview.py "data/gs6/unit-7/vocab"
```

## Các tính năng nổi bật trong giao diện Preview

- **Zero CORS / Hoạt động Offline 100%**: Dữ liệu JSON được tích hợp an toàn vào HTML, người dùng chỉ cần click đúp vào file `preview.html` là xem được ngay trên mọi trình duyệt mà không cần cài local server.
- **Tự động xử lý đường dẫn ảnh & âm thanh**:
  - Tự động tính toán đường dẫn tương đối tới thư mục `lessons/media/...` từ vị trí file HTML.
  - Tích hợp **Web Speech API** thông minh: khi bấm nút loa 🔊, nếu chưa có file MP3 trên máy, trình duyệt sẽ tự động phát âm tiếng Anh chuẩn bản xứ.
  - Phóng to ảnh (Lightbox) khi click vào ảnh từ vựng.
- **Thanh điều hướng thông minh**:
  - Tab chuyển đổi giữa **Từ vựng (Vocabulary)**, **16 Dạng bài tập (Exercises)** và **Image Prompts**.
  - Thanh tìm kiếm từ khóa tức thì trong bài học.
  - Nút chuyển đổi giao diện **Sáng / Tối (Light / Dark Mode)**.
  - Nút In ấn / Xuất PDF (`Ctrl+P` hoặc icon máy in) chuẩn định dạng tài liệu dạy học.
- **Hỗ trợ 16 dạng bài tập với giao diện chuyên biệt**:
  - Trắc nghiệm: Nút chọn sinh động, màu sắc trực quan, tự chấm điểm.
  - Điền từ & Đoạn văn: Khung Word Bank tương tác, gạch từ khi đã sử dụng.
  - Thẻ từ điển: Trình bày như Oxford Learner's Dictionary kèm bài tập vận dụng.
  - Biển báo: Render card biển báo sinh động với mô tả và câu hỏi.
  - Gia đình từ: Bảng tổng hợp các dạng từ Verb / Noun / Adjective / Adverb.
  - Dịch câu: Nhập bản dịch và mở đối chiếu đáp án mẫu.
