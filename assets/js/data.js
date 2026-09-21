/**
 * AI Agent Hub & Studio - Core Data Store
 * Extracted and compiled from c:\Users\DELL\OneDrive\Desktop\Demo_Project\.agent
 */

const AGENT_STUDIO_DATA = {
  projectInfo: {
    title: "AI Agent Operating Hub & Studio",
    version: "2.5.0",
    ecosystem: ".agent English Curriculum Automation",
    targetCurriculum: "Global Success (Grades 6 - 9)",
    activeSkillsCount: 10,
    qaDimensionsCount: 6,
    exerciseTypesCount: 16,
    activeDemoUnit: {
      name: "Global Success 6 - Unit 7: Traffic & Environment",
      path: "data/gs6/unit-7/vocab",
      previewUrl: "data/gs6/unit-7/vocab/preview.html",
      vocabCount: 20,
      exerciseFilesCount: 16
    }
  },

  pipelineStages: [
    {
      id: "stage-1",
      stepNumber: "Step 01",
      name: "OCR Vision Extraction",
      skillId: "skills-data-vocab-step-1-ocr-raw-content",
      badge: "Vision AI",
      category: "pipeline",
      icon: "file-text",
      input: "PDF Sách giáo khoa (gs6-2.pdf) / Ảnh scan",
      output: "raw-content.md (Textbook content)",
      summary: "Nhận diện thị giác trang sách bằng AI Vision, trích xuất cấu trúc văn bản, hội thoại, từ vựng và bài tập nguyên bản.",
      status: "ready"
    },
    {
      id: "stage-2",
      stepNumber: "Step 02",
      name: "Topic Vocab Grouping",
      skillId: "skills-data-vocab-step-2-raw-vocabulary",
      badge: "Lexical AI",
      category: "pipeline",
      icon: "list-ordered",
      input: "raw-content.md",
      output: "raw-vocabulary.md (Topic clusters)",
      summary: "Phân tích nội dung thô, lọc bỏ từ dừng (stop-words), gom nhóm từ vựng theo chủ đề trọng tâm của Unit (Phương tiện, An toàn, Môi trường).",
      status: "ready"
    },
    {
      id: "stage-3",
      stepNumber: "Step 03",
      name: "Rich Vocab JSON Synthesis",
      skillId: "skills-data-vocab-step-3-vocab-json",
      badge: "Enrichment",
      category: "pipeline",
      icon: "database",
      input: "raw-content.md + raw-vocabulary.md",
      output: "vocab.json (12 trường dữ liệu)",
      summary: "Chuẩn hóa từ điển số: phiên âm IPA UK/US, dịch nghĩa tiếng Việt, câu ví dụ đa ngữ cảnh, đường dẫn âm thanh và ảnh minh họa.",
      status: "ready"
    },
    {
      id: "stage-4",
      stepNumber: "Step 04",
      name: "Visual Prompt Engineering",
      skillId: "skills-data-vocab-step-4-image-prompts",
      badge: "Prompt Craft",
      category: "media",
      icon: "image",
      input: "vocab.json",
      output: "image-prompts.json",
      summary: "Kiến tạo prompts sinh ảnh độ nét cao theo phong cách sư phạm hiện đại (clean 3D render hoặc minh họa vector 2D) cho từng từ.",
      status: "ready"
    },
    {
      id: "stage-5",
      stepNumber: "Step 05",
      name: "Batch Media Generation",
      skillId: "skills-data-vocab-step-5-generate-images",
      badge: "Generative AI",
      category: "media",
      icon: "sparkles",
      input: "image-prompts.json",
      output: "lessons/media/<book>/<unit>/images/*.webp",
      summary: "Tự động kích hoạt mô hình sinh ảnh AI, tối ưu hóa kích thước và định dạng WebP, lưu trữ theo cấu trúc thư mục quy chuẩn.",
      status: "ready"
    },
    {
      id: "stage-7",
      stepNumber: "Step 07",
      name: "16 Exercise Types Suite",
      skillId: "skills-data-vocab-step-7-practice",
      badge: "Curriculum Engine",
      category: "pipeline",
      icon: "book-open",
      input: "vocab.json + raw-content.md",
      output: "vocab/exercises/*.json (16 files)",
      summary: "Sinh đồng loạt 16 dạng bài tập trắc nghiệm và tự luận, tự động cân bằng phân bổ đáp án A/B/C/D và kiểm tra độ phủ từ vựng ≥95%.",
      status: "ready"
    },
    {
      id: "stage-qa-1",
      stepNumber: "QA Phase 1",
      name: "Context & Storyline De-Duplication",
      skillId: "skills-fix-context-duplications-agent",
      badge: "Multi-Agent QA",
      category: "quality",
      icon: "layers",
      input: "vocab/exercises/*.json",
      output: "Verified diversified exercises",
      summary: "Hội đồng 3 subagent quét chéo 16 file bài tập, xóa sạch các tình huống lặp lại, nhân vật sáo rỗng, đa dạng hóa thành 6 lát cắt đời sống.",
      status: "ready"
    },
    {
      id: "stage-qa-2",
      stepNumber: "QA Phase 2",
      name: "Logic & Naturalness Auditor",
      skillId: "skills-fix-logic-naturalness",
      badge: "Pragmatics QA",
      category: "quality",
      icon: "check-circle-2",
      input: "vocab/exercises/*.json",
      output: "Natural polished sentences",
      summary: "Thẩm tra logic hành động thực tế, loại bỏ Vietlish, câu văn nhồi nhét tính từ thừa và hiệu chỉnh collocation chuẩn người bản xứ.",
      status: "ready"
    },
    {
      id: "stage-qa-3",
      stepNumber: "QA Phase 3",
      name: "6-Agent Multi-Dimensional Audit",
      skillId: "skills-5-agent-audit",
      badge: "Supreme QA",
      category: "quality",
      icon: "shield-check",
      input: "Toàn bộ Unit / Exercises",
      output: "Báo cáo thẩm định toàn diện (Gold Standard)",
      summary: "Hội đồng 6 chuyên gia thẩm định song song: Bản ngữ, Ngữ pháp, Logic hành động, Lứa tuổi 11-15, CEFR và Chuẩn schema JSON.",
      status: "ready"
    },
    {
      id: "stage-delivery",
      stepNumber: "Delivery",
      name: "Interactive Vocab Preview Web",
      skillId: "skills-vocab-preview",
      badge: "Web Standalone",
      category: "preview",
      icon: "layout",
      input: "vocab.json + exercises/*.json",
      output: "preview.html (Zero CORS, 100% Offline)",
      summary: "Đóng gói toàn bộ học liệu thành ứng dụng web độc lập, hỗ trợ cả chế độ Học sinh luyện tập (Student) và Giáo viên kiểm duyệt (Teacher).",
      status: "ready"
    }
  ],

  skills: [
    {
      id: "skills-5-agent-audit",
      name: "5-Agent Multi-Dimensional Quality Audit",
      category: "quality",
      badge: "Supreme Audit",
      shortDesc: "Hội đồng 6 subagent thẩm định độc lập đa chiều: Bản ngữ, Ngữ pháp, Logic, Lứa tuổi, CEFR & Schema JSON.",
      triggers: ["kiểm tra bằng agent", "5-agent audit", "6-agent audit", "thẩm định đa chiều", "audit exercises"],
      path: ".agent/skills/skills-5-agent-audit",
      subagents: [
        { name: "Native English Auditor", role: "Rà soát tính tự nhiên, loại bỏ diễn đạt gượng gạo và Vietlish." },
        { name: "Grammar & Tense Specialist", role: "Cô lập thì tuyệt đối, kiểm soát tính duy nhất của đáp án đúng." },
        { name: "Pragmatics & Logic Auditor", role: "Mô phỏng chuỗi hành động thực tế, chống nghịch lý thời gian." },
        { name: "Curriculum & Age Auditor", role: "Cân chỉnh tâm lý học sinh 11-15 tuổi (Global Success 6-9)." },
        { name: "Vocabulary & CEFR Auditor", role: "Kiểm soát từ vựng theo khung CEFR A1-B1, bám sát sách giáo khoa." },
        { name: "Format & Schema Auditor", role: "Xác thực cấu trúc JSON, cân bằng vị trí đáp án A/B/C/D đồng đều." }
      ],
      mandatoryRules: [
        "Quy tắc bắt buộc Anh - Anh / Anh - Mỹ (Mandatory UK/US Rule): Phát hiện từ vựng hoặc chính tả khác nhau (colour/color, centre/center, travelling/traveling) BẮT BUỘC hỏi ý kiến người dùng, KHÔNG tự ý chỉnh sửa nếu chưa được yêu cầu."
      ],
      scripts: [],
      references: [],
      promptTemplate: "Hãy sử dụng kỹ năng 5-agent-audit để thẩm định toàn bộ các file bài tập trong thư mục data/{book}/{unit}/vocab/exercises. Điều phối 6 subagent chuyên biệt để phát hiện các lỗi về bản ngữ, ngữ pháp, logic, lứa tuổi, CEFR và định dạng JSON."
    },
    {
      id: "skills-data-vocab-step-1-ocr-raw-content",
      name: "Vocab Step 1: OCR PDF to Raw Content",
      category: "pipeline",
      badge: "Data Ingestion",
      shortDesc: "Dùng Vision AI chuyển đổi trang sách giáo khoa PDF thành file Markdown cấu trúc (raw-content.md).",
      triggers: ["ocr pdf", "raw-content.md", "vocab step 1 ocr", "trích xuất trang sách"],
      path: ".agent/skills/skills-data-vocab-step-1-ocr-raw-content",
      subagents: [],
      mandatoryRules: [
        "Bảo toàn nguyên vẹn 100% nội dung chữ, bảng biểu, hộp hội thoại và chú thích từ sách giáo khoa gốc.",
        "Định dạng rõ ràng các phần: Getting Started, A Closer Look 1, A Closer Look 2, Communication, Skills 1, Skills 2, Looking Back."
      ],
      scripts: [],
      references: [],
      promptTemplate: "Hãy chạy vocab step 1: Sử dụng Vision AI để OCR các trang {pages} từ file {pdf_file} và lưu cấu trúc vào data/{book}/{unit}/raw-content.md."
    },
    {
      id: "skills-data-vocab-step-2-raw-vocabulary",
      name: "Vocab Step 2: Extract Raw Vocabulary",
      category: "pipeline",
      badge: "Lexical Extraction",
      shortDesc: "Trích xuất danh sách từ vựng cốt lõi từ raw-content.md và phân loại theo các nhóm chủ đề bài học.",
      triggers: ["vocab step 2", "raw-vocabulary.md", "trích xuất từ vựng unit", "nhóm từ vựng"],
      path: ".agent/skills/skills-data-vocab-step-2-raw-vocabulary",
      subagents: [],
      mandatoryRules: [
        "Gom cụm từ vựng theo 2-4 nhóm chủ đề rõ ràng (ví dụ: Phương tiện giao thông, Biển báo an toàn, Hành vi bảo vệ môi trường).",
        "Bổ sung cả các dạng từ loại liên quan (Word family root) để phục vụ cho các bài tập dạng từ sau này."
      ],
      scripts: [],
      references: [],
      promptTemplate: "Hãy chạy vocab step 2: Trích xuất danh sách từ vựng trọng tâm từ data/{book}/{unit}/raw-content.md và lưu vào data/{book}/{unit}/raw-vocabulary.md có phân nhóm chủ đề."
    },
    {
      id: "skills-data-vocab-step-3-vocab-json",
      name: "Vocab Step 3: Vocab JSON Enrichment",
      category: "pipeline",
      badge: "Data Structuring",
      shortDesc: "Xây dựng từ điển số hoàn chỉnh (vocab.json) chuẩn 12 trường: phiên âm IPA UK/US, định nghĩa, ví dụ, media.",
      triggers: ["vocab step 3", "vocab.json", "từ điển json", "chuẩn hóa từ vựng"],
      path: ".agent/skills/skills-data-vocab-step-3-vocab-json",
      subagents: [],
      mandatoryRules: [
        "Bắt buộc chuẩn 12 trường dữ liệu cho mỗi từ vựng.",
        "Bao gồm cả audio UK/US tương ứng và đường dẫn media theo định dạng: lessons/media/{book}/{unit}/images/{word}.webp."
      ],
      scripts: [
        { name: "merge_vocab_parts.py", path: ".agent/skills/skills-data-vocab-step-3-vocab-json/scripts/merge_vocab_parts.py", desc: "Ghép các phần từ vựng được sinh từng đợt thành một file vocab.json đồng nhất." }
      ],
      references: [
        { name: "vocab-fields.md", path: ".agent/skills/skills-data-vocab-step-3-vocab-json/reference/vocab-fields.md", desc: "Quy chuẩn định nghĩa 12 trường dữ liệu bắt buộc trong vocab.json." }
      ],
      promptTemplate: "Hãy chạy vocab step 3: Đọc data/{book}/{unit}/raw-vocabulary.md và raw-content.md để sinh ra file data/{book}/{unit}/vocab/vocab.json đầy đủ phiên âm IPA UK/US, ví dụ, giải nghĩa và đường dẫn media."
    },
    {
      id: "skills-data-vocab-step-4-image-prompts",
      name: "Vocab Step 4: AI Image Prompt Generator",
      category: "media",
      badge: "Prompt Engineering",
      shortDesc: "Sinh bộ prompts chi tiết cho mô hình AI tạo ảnh minh họa từ vựng (image-prompts.json).",
      triggers: ["vocab step 4", "image prompts", "image-prompts.json", "prompts sinh ảnh"],
      path: ".agent/skills/skills-data-vocab-step-4-image-prompts",
      subagents: [],
      mandatoryRules: [
        "Prompt mô tả rõ bối cảnh, vật thể chính, ánh sáng và phong cách thị giác sư phạm trong sáng.",
        "Tránh các chi tiết nhạy cảm, giữ tỷ lệ khung hình 1:1 tiêu chuẩn."
      ],
      scripts: [],
      references: [],
      promptTemplate: "Hãy chạy vocab step 4: Dựa vào data/{book}/{unit}/vocab/vocab.json, hãy tạo file data/{book}/{unit}/vocab/image-prompts.json chứa các prompt tiếng Anh tối ưu để sinh ảnh minh họa."
    },
    {
      id: "skills-data-vocab-step-5-generate-images",
      name: "Vocab Step 5: Batch Image Generation",
      category: "media",
      badge: "Asset Generation",
      shortDesc: "Sinh ảnh tự động hàng loạt từ image-prompts.json và lưu trữ vào thư mục media của bài học.",
      triggers: ["vocab step 5", "generate images", "sinh ảnh hàng loạt", "batch generate"],
      path: ".agent/skills/skills-data-vocab-step-5-generate-images",
      subagents: [],
      mandatoryRules: [
        "Định dạng ảnh đầu ra: WebP tối ưu dung lượng tải web.",
        "Đường dẫn lưu trữ bắt buộc: lessons/media/{book}/{unit}/images/{word}.webp."
      ],
      scripts: [],
      references: [],
      promptTemplate: "Hãy chạy vocab step 5: Đọc prompts từ data/{book}/{unit}/vocab/image-prompts.json và tiến hành sinh toàn bộ ảnh minh họa vào lessons/media/{book}/{unit}/images/."
    },
    {
      id: "skills-data-vocab-step-7-practice",
      name: "Vocab Step 7: 16 Practice Exercises Suite",
      category: "pipeline",
      badge: "Exercise Generator",
      shortDesc: "Sinh trọn bộ 16 dạng bài tập trắc nghiệm & tự luận đa dạng kèm 5 scripts cân bằng và kiểm tra độ phủ.",
      triggers: ["vocab step 7", "tạo bài tập", "sinh 16 dạng bài tập", "practice exercises"],
      path: ".agent/skills/skills-data-vocab-step-7-practice",
      subagents: [],
      mandatoryRules: [
        "Sinh đủ 16 file JSON tương ứng 16 dạng bài tập.",
        "Độ phủ từ vựng phải đạt ≥ 95% (kiểm tra bằng vocab_coverage_checker.py).",
        "Phân bổ đáp án A, B, C, D phải đạt xấp xỉ 25% mỗi đáp án (chạy balance_mcq_options.py).",
        "Tuân thủ trần ngữ pháp theo grammar-roadmap.md của từng Unit."
      ],
      scripts: [
        { name: "balance_mcq_options.py", desc: "Tự động xáo trộn vị trí đáp án đúng để phân bổ đều A/B/C/D." },
        { name: "reorder_vocab_ids.py", desc: "Đánh số lại ID câu hỏi từ 1 đến N liên tục trong mỗi file." },
        { name: "shuffle_dictionary_boxes.py", desc: "Xáo trộn thứ tự các từ trong hộp từ vựng dạng bài từ điển." },
        { name: "shuffle_word_box.py", desc: "Xáo trộn Word Bank trong bài tập điền từ." },
        { name: "vocab_coverage_checker.py", desc: "Kiểm tra tỷ lệ xuất hiện của danh sách từ vựng trong 16 bài tập." }
      ],
      references: [
        { name: "exercise-rules.md", desc: "Quy tắc biên soạn chi tiết cho từng dạng bài tập." },
        { name: "json-schemas.md", desc: "Đặc tả schema JSON chuẩn của 16 dạng bài." },
        { name: "grammar-roadmap.md", desc: "Trần ngữ pháp cho phép của từng Grade và Unit." },
        { name: "quality-checks.md", desc: "Quy trình kiểm tra độ phủ và rà soát chất lượng cuối." }
      ],
      promptTemplate: "Hãy chạy vocab step 7: Sinh toàn bộ 16 file bài tập JSON trong data/{book}/{unit}/vocab/exercises/ dựa trên vocab.json và raw-content.md. Sau đó chạy scripts cân bằng đáp án và kiểm tra độ phủ từ vựng."
    },
    {
      id: "skills-fix-context-duplications-agent",
      name: "Context Diversification & De-Duplication Agent",
      category: "quality",
      badge: "Scenario Diversifier",
      shortDesc: "Hệ thống 3 subagent chuyên trách xóa sạch trùng lặp bối cảnh, tên nhân vật, hành vi giữa các bài tập.",
      triggers: ["kiểm tra trùng lặp ngữ cảnh", "đa dạng hóa ngữ cảnh", "xóa lặp bối cảnh", "fix duplicate contexts"],
      path: ".agent/skills/skills-fix-context-duplications-agent",
      subagents: [
        { name: "Context Cluster Auditor", role: "Phát hiện nhân vật lặp lại, bối cảnh sao chép và cốt truyện trùng lặp giữa các bài tập." },
        { name: "Creative Context Architect", role: "Sáng tạo các góc nhìn tình huống mới dựa trên 6 lát cắt đời sống thực tế." },
        { name: "Pedagogy & Integrity Verifier", role: "Xác thực câu mới giữ nguyên 100% đáp án đúng và trọng tâm từ vựng." }
      ],
      mandatoryRules: [
        "Áp dụng 6 lát cắt đời sống: Gia đình & Thói quen, Hoạt động học đường & Bạn bè, Đời sống đô thị, Thiên nhiên & Dã ngoại, Công nghệ & Tương lai, Văn hóa & Nghệ thuật.",
        "Không thay đổi từ khóa kiểm tra hoặc làm sai lệch đáp án đúng ban đầu."
      ],
      scripts: [
        { name: "prepare_context_audit.py", desc: "Trích xuất và nhóm các câu văn từ 16 file bài tập theo chủ thể và bối cảnh để subagent kiểm tra." }
      ],
      references: [],
      promptTemplate: "Hãy kích hoạt skill fix-context-duplications-agent cho thư mục data/{book}/{unit}/vocab/exercises. Triển khai 3 subagent để quét chéo các bài tập, phát hiện cụm ngữ cảnh trùng lặp và đa dạng hóa theo 6 lát cắt đời sống."
    },
    {
      id: "skills-fix-logic-naturalness",
      name: "Pragmatic Logic & Naturalness Auditor",
      category: "quality",
      badge: "Authenticity QA",
      shortDesc: "Rà soát tính tự nhiên, logic quan hệ nhân quả và loại bỏ cách diễn đạt nhồi nhét tính từ hoặc dịch thô.",
      triggers: ["kiểm tra logic", "fix unnatural phrasing", "tính tự nhiên câu văn", "logic naturalness"],
      path: ".agent/skills/skills-fix-logic-naturalness",
      subagents: [],
      mandatoryRules: [
        "Loại bỏ tính từ thừa vô nghĩa (famous, amazing, brilliant, fantastic...).",
        "Sửa các lỗi collocation sai do dịch từ tiếng Việt (give congratulations -> congratulate, play skipping -> skip).",
        "Đảm bảo quan hệ logic các vế câu nối bằng and/so/but/because không mâu thuẫn."
      ],
      scripts: [],
      references: [
        { name: "logic-naturalness-checklist.md", desc: "Bảng kiểm tra 6 nhóm lỗi logic và câu văn thiếu tự nhiên thường gặp." }
      ],
      promptTemplate: "Hãy sử dụng skill fix-logic-naturalness để kiểm tra toàn bộ các bài tập trong data/{book}/{unit}/vocab/exercises. Sửa lại tất cả các câu văn nhồi nhét tính từ, collocation gượng gạo hoặc thiếu logic hành động thực tế."
    },
    {
      id: "skills-vocab-preview",
      name: "Interactive Vocab & Exercise Preview Generator",
      category: "preview",
      badge: "Web Generator",
      shortDesc: "Đóng gói toàn bộ học liệu thành file HTML độc lập có tương tác, hỗ trợ âm thanh Web Speech và chế độ Giáo viên/Học sinh.",
      triggers: ["tạo preview", "xem trước bài tập", "preview.html", "tạo file html học liệu", "vocab-preview"],
      path: ".agent/skills/skills-vocab-preview",
      subagents: [],
      mandatoryRules: [
        "Zero CORS / Hoạt động Offline 100% bằng cách nhúng dữ liệu trực tiếp trong file HTML.",
        "Tích hợp Web Speech API tự động phát âm khi chưa có file MP3 offline.",
        "Hỗ trợ cả Chế độ Luyện tập (Student Mode) và Chế độ Thẩm định (Teacher Review Mode)."
      ],
      scripts: [
        { name: "generate_preview.ps1", desc: "Script PowerShell tạo preview.html nhanh chóng trên môi trường Windows." },
        { name: "generate_preview.py", desc: "Script Python đa nền tảng để compile dữ liệu vocab và exercises thành preview.html." },
        { name: "template.html", desc: "Template HTML cao cấp với hệ thống theme sáng/tối và giao diện 16 bài tập." }
      ],
      references: [],
      promptTemplate: "Hãy chạy vocab-preview để tạo file preview.html cho bài học data/{book}/{unit}/vocab. Đảm bảo nhúng đầy đủ vocab.json, 16 bài tập và image prompts."
    }
  ],

  exerciseTypes: [
    {
      number: "01",
      filename: "01_multiple_choice_direct.json",
      title: "Multiple Choice - Direct Questions",
      type: "multiple_choice",
      questionCount: "10 câu",
      category: "Trắc nghiệm",
      icon: "help-circle",
      description: "Câu hỏi trắc nghiệm trực tiếp về định nghĩa, chức năng hoặc đặc điểm của từ vựng.",
      rules: [
        "10 câu hỏi độc lập, 4 lựa chọn (A, B, C, D).",
        "Câu hỏi ngắn gọn, hỏi trực tiếp vào bản chất từ vựng.",
        "Các đáp án nhiễu phải có độ dài tương đồng và thuộc cùng trường nghĩa."
      ],
      schemaSample: {
        id: "1",
        type: "multiple_choice",
        title: "Multiple Choice - Direct Questions",
        description: "Choose the best answer for each question.",
        questions: [
          {
            id: "1",
            text: "Which of the following helps save trees?",
            options: ["cutting down forests", "reusing paper", "wasting water", "making noise"],
            correct_answer: "reusing paper"
          }
        ]
      }
    },
    {
      number: "02",
      filename: "02_multiple_choice_sentence.json",
      title: "Multiple Choice - Sentence Completion",
      type: "multiple_choice",
      questionCount: "10 câu",
      category: "Trắc nghiệm",
      icon: "check-square",
      description: "Điền từ vào chỗ trống trong câu đơn hoặc câu ghép để hoàn thành ngữ cảnh.",
      rules: [
        "10 câu có chỗ trống dạng ________.",
        "Chỉ có 1 từ duy nhất phù hợp cả về ngữ nghĩa lẫn ngữ pháp.",
        "Ngữ cảnh câu tự nhiên, gần gũi với lứa tuổi học sinh."
      ],
      schemaSample: {
        id: "2",
        type: "multiple_choice",
        title: "Multiple Choice - Sentence Completion",
        description: "Choose the correct word to complete the sentence.",
        questions: [
          {
            id: "1",
            text: "We should follow the 3Rs to protect our __________.",
            options: ["environment", "classroom", "school", "home"],
            correct_answer: "environment"
          }
        ]
      }
    },
    {
      number: "03",
      filename: "03_multiple_choice_conversation.json",
      title: "Multiple Choice - Conversation Completion",
      type: "multiple_choice",
      questionCount: "10 câu",
      category: "Trắc nghiệm",
      icon: "message-square",
      description: "Chọn câu hồi đáp hoặc câu hỏi phù hợp nhất trong đoạn hội thoại ngắn 2 nhân vật.",
      rules: [
        "10 tình huống giao tiếp sinh động giữa 2 nhân vật.",
        "Sử dụng văn phong giao tiếp tự nhiên của người bản ngữ.",
        "Không dùng câu trả lời gượng gạo hoặc dịch từng chữ từ tiếng Việt."
      ],
      schemaSample: {
        id: "3",
        type: "multiple_choice",
        title: "Multiple Choice - Conversation Completion",
        description: "Choose the correct response to complete the conversation.",
        questions: [
          {
            id: "1",
            text: "Teacher: 'How can we go green?'\nStudent: '______________________________'",
            options: [
              "By wasting water.",
              "By making more noise.",
              "By planting trees and recycling.",
              "By using more plastic bags."
            ],
            correct_answer: "By planting trees and recycling."
          }
        ]
      }
    },
    {
      number: "04",
      filename: "04_pic_to_word.json",
      title: "Picture to Word Matching",
      type: "pic_to_word",
      questionCount: "20 câu",
      category: "Thị giác",
      icon: "image",
      description: "Quan sát ảnh minh họa và chọn từ vựng tiếng Anh tương ứng chính xác nhất.",
      rules: [
        "20 câu gắn liền với ảnh minh họa trong thư mục media.",
        "Đường dẫn ảnh sao chép chính xác từ vocab.json.",
        "Lựa chọn đáp án gồm 4 từ vựng tiếng Anh khác nhau."
      ],
      schemaSample: {
        id: "4",
        type: "pic_to_word",
        title: "Picture to Word",
        description: "Look at the picture and choose the correct word.",
        questions: [
          {
            id: "1",
            image: "lessons/media/gs6/unit-7/images/traffic-light.webp",
            options: ["traffic jam", "traffic lights", "pedestrian", "zebra crossing"],
            correct_answer: "traffic lights"
          }
        ]
      }
    },
    {
      number: "05",
      filename: "05_write_english_words.json",
      title: "Write English Words (Definitions & Context)",
      type: "write_english_words",
      questionCount: "10 câu × 2 phần",
      category: "Tự luận",
      icon: "edit-3",
      description: "Đọc định nghĩa tiếng Anh và câu ví dụ để tự gõ từ vựng tiếng Anh chính xác.",
      rules: [
        "10 câu hỏi, mỗi câu có 2 phần: Part A (Đoán từ qua định nghĩa), Part B (Điền từ vào câu ví dụ).",
        "Có gợi ý ký tự đầu tiên và số lượng ký tự.",
        "Hỗ trợ tự động kiểm tra chính tả khi học sinh gõ đáp án."
      ],
      schemaSample: {
        id: "5",
        type: "write_english_words",
        title: "Write English Words",
        description: "Read the definitions and write the correct English words.",
        questions: [
          {
            id: "1",
            hint: "p _ _ _ _ _ _ _ _ _",
            definition: "a person walking rather than travelling in a vehicle",
            example: "Drivers must yield to a __________ at the zebra crossing.",
            correct_answer: "pedestrian"
          }
        ]
      }
    },
    {
      number: "06",
      filename: "06_fill_in_blanks.json",
      title: "Fill in Blanks with Word Bank",
      type: "fill_in_blanks",
      questionCount: "10 câu",
      category: "Điền từ",
      icon: "file-input",
      description: "Điền các từ cho sẵn trong khung (Word Bank) vào 10 câu tình huống độc lập.",
      rules: [
        "10 câu hỏi kèm 10 từ trong Word Bank (đã qua xáo trộn bằng shuffle_word_box.py).",
        "Mỗi từ chỉ dùng duy nhất 1 lần, không trùng lặp.",
        "Dạng từ cần chia phù hợp ngữ cảnh thì và số ít/số nhiều."
      ],
      schemaSample: {
        id: "6",
        type: "fill_in_blanks",
        title: "Fill in the Blanks",
        description: "Choose the correct words from the box to complete the sentences.",
        word_bank: ["helmet", "zebra crossing", "passenger", "seatbelt", "rush hour"],
        questions: [
          {
            id: "1",
            text: "Always fasten your __________ when you sit in a car.",
            correct_answer: "seatbelt"
          }
        ]
      }
    },
    {
      number: "07",
      filename: "07_paragraph_fill.json",
      title: "Paragraph Cloze Test",
      type: "paragraph_fill",
      questionCount: "10 chỗ trống",
      category: "Điền từ",
      icon: "file-text",
      description: "Đoạn văn hoàn chỉnh có tính liên kết cao với 10 chỗ trống cần điền từ Word Bank.",
      rules: [
        "Một đoạn văn hoàn chỉnh 150-250 từ xoay quanh chủ đề Unit.",
        "10 vị trí trống được đánh số thứ tự (1) đến (10).",
        "Từ trong Word Bank không trùng lặp với danh sách của bài tập số 6."
      ],
      schemaSample: {
        id: "7",
        type: "paragraph_fill",
        title: "Paragraph Fill",
        description: "Fill in the blanks with the words from the box.",
        word_bank: ["bicycles", "protect", "reduce", "clean", "pollution"],
        paragraph: "In modern cities, people are trying to (1) __________ air pollution. Many students ride (2) __________ to school instead of being driven by motorbikes...",
        answers: {
          "1": "reduce",
          "2": "bicycles"
        }
      }
    },
    {
      number: "08",
      filename: "08_sentence_ordering.json",
      title: "Sentence Ordering & Cohesion",
      type: "sentence_ordering_multiple_choice",
      questionCount: "5 câu",
      category: "Đọc hiểu",
      icon: "move",
      description: "Sắp xếp thứ tự các câu văn hoặc lượt thoại để tạo thành một đoạn văn/hội thoại hoàn chỉnh.",
      rules: [
        "5 câu hỏi, mỗi câu gồm 4-5 mảnh ghép câu (a, b, c, d).",
        "Dựa vào logic mạch ý và đại từ liên kết, KHÔNG dùng trạng từ máy móc (Firstly, Secondly, Finally).",
        "Có ít nhất 2 câu hỏi dạng hội thoại 2 nhân vật đối đáp."
      ],
      schemaSample: {
        id: "8",
        type: "sentence_ordering_multiple_choice",
        title: "Sentence Ordering",
        description: "Choose the correct order of sentences to form a meaningful passage.",
        questions: [
          {
            id: "1",
            fragments: [
              { label: "a", text: "He put on his helmet and checked his bicycle brakes." },
              { label: "b", text: "Nam decided to ride his bicycle to school this morning." },
              { label: "c", text: "On the way, he always stopped at red lights." },
              { label: "d", text: "He arrived at school safely and on time." }
            ],
            options: ["b - a - c - d", "a - b - c - d", "b - c - a - d", "c - a - b - d"],
            correct_answer: "b - a - c - d"
          }
        ]
      }
    },
    {
      number: "09",
      filename: "09_multiple_choice_closest.json",
      title: "Closest in Meaning (Synonyms)",
      type: "multiple_choice",
      questionCount: "5 câu",
      category: "Từ vựng sâu",
      icon: "copy",
      description: "Chọn từ/cụm từ đồng nghĩa gần nhất với từ được gạch chân trong câu ngữ cảnh.",
      rules: [
        "5 câu trắc nghiệm từ đồng nghĩa.",
        "Từ được gạch chân phải nằm trong danh mục từ vựng bài học.",
        "Đáp án phải thay thế được vào câu mà không làm đổi nghĩa."
      ],
      schemaSample: {
        id: "9",
        type: "multiple_choice",
        title: "Closest in Meaning",
        description: "Choose the word CLOSEST in meaning to the underlined word.",
        questions: [
          {
            id: "1",
            text: "We should <u>reduce</u> the amount of plastic waste we produce every day.",
            options: ["cut down on", "increase", "throw away", "pick up"],
            correct_answer: "cut down on"
          }
        ]
      }
    },
    {
      number: "10",
      filename: "10_multiple_choice_opposite.json",
      title: "Opposite in Meaning (Antonyms)",
      type: "multiple_choice",
      questionCount: "5 câu",
      category: "Từ vựng sâu",
      icon: "shuffle",
      description: "Chọn từ/cụm từ trái nghĩa với từ được gạch chân (loại trừ các tiền tố un-, in-, dis- đơn giản).",
      rules: [
        "5 câu trắc nghiệm từ trái nghĩa thực chất.",
        "BẮT BUỘC: Không dùng tiền tố hình thức (un-, in-, dis-) làm đáp án đúng.",
        "Học sinh phải hiểu thực chất ngữ nghĩa để chọn từ đối lập."
      ],
      schemaSample: {
        id: "10",
        type: "multiple_choice",
        title: "Opposite in Meaning",
        description: "Choose the word OPPOSITE in meaning to the underlined word.",
        questions: [
          {
            id: "1",
            text: "It is <u>dangerous</u> to ride a motorbike without a helmet.",
            options: ["safe", "harmful", "risky", "difficult"],
            correct_answer: "safe"
          }
        ]
      }
    },
    {
      number: "11",
      filename: "11_dictionary_entry.json",
      title: "Dictionary Entry Analysis",
      type: "dictionary_entry",
      questionCount: "5 mục × 2 câu",
      category: "Từ vựng sâu",
      icon: "book",
      description: "Đọc mục từ điển phong cách Oxford (gồm 4 collocation khác nhau) và làm 2 câu hỏi vận dụng.",
      rules: [
        "5 mục từ điển, mỗi mục có 4 mẫu collocation không thể thay thế cho nhau.",
        "2 câu hỏi ứng dụng thực tế cho mỗi từ.",
        "Không dùng lại các từ khóa tiết lộ trong câu ví dụ của từ điển."
      ],
      schemaSample: {
        id: "11",
        type: "dictionary_entry",
        title: "Dictionary Entry Analysis",
        description: "Read the dictionary entry and answer the questions.",
        entries: [
          {
            id: "1",
            word: "traffic",
            part_of_speech: "noun [uncountable]",
            definition: "the vehicles that are on a road at a particular time",
            collocations: [
              "heavy traffic: a large number of vehicles",
              "traffic jam: a line of vehicles moving very slowly",
              "traffic rules: the laws for road safety",
              "direct traffic: police officer controlling vehicle flow"
            ],
            questions: [
              {
                id: "1-1",
                text: "We were stuck in a __________ for nearly an hour on our way home.",
                options: ["traffic jam", "heavy traffic", "traffic rules", "direct traffic"],
                correct_answer: "traffic jam"
              }
            ]
          }
        ]
      }
    },
    {
      number: "12",
      filename: "12_signs_and_notices.json",
      title: "Signs, Notices & Announcements",
      type: "signs_and_notices",
      questionCount: "10 câu",
      category: "Thực tế",
      icon: "alert-triangle",
      description: "Phân tích biển báo giao thông hoặc thông báo công cộng để chọn thông điệp đúng.",
      rules: [
        "10 câu hỏi dựa trên biển báo và bảng tin thực tế.",
        "4 lựa chọn trả lời có độ dài ký tự đồng đều (balanced character length).",
        "Đồng nhất ngôi xưng hô (We khi câu hỏi dùng Us)."
      ],
      schemaSample: {
        id: "12",
        type: "signs_and_notices",
        title: "Signs and Notices",
        description: "Read the sign or notice and choose the best explanation.",
        questions: [
          {
            id: "1",
            sign_title: "NO CYCLING ON FOOTPATH",
            sign_context: "Sign placed at the entrance of city park pedestrian path",
            text: "What does this sign mean?",
            options: [
              "You cannot ride your bicycle here.",
              "You must wear a helmet on this path.",
              "You can rent a bicycle in this park.",
              "You should walk your dog on this road."
            ],
            correct_answer: "You cannot ride your bicycle here."
          }
        ]
      }
    },
    {
      number: "13",
      filename: "13_word_families_table.json",
      title: "Word Families Table",
      type: "word_families_table",
      questionCount: "Tối đa 10 hàng",
      category: "Dạng từ",
      icon: "grid",
      description: "Bảng tổng hợp họ từ vựng đầy đủ 4 cột: Động từ, Danh từ, Tính từ, Trạng từ.",
      rules: [
        "Tối đa 10 họ từ liên quan mật thiết đến từ vựng bài học.",
        "Điền đầy đủ các ô có nghĩa trong tiếng Anh hoặc đánh dấu '-' nếu không tồn tại.",
        "Dùng làm tài liệu đối chiếu cho học sinh khi làm bài tập 14 và 15."
      ],
      schemaSample: {
        id: "13",
        type: "word_families_table",
        title: "Word Families Table",
        description: "Study the table of word families.",
        rows: [
          {
            verb: "pollute",
            noun: "pollution, pollutant",
            adjective: "polluted",
            adverb: "-"
          },
          {
            verb: "protect",
            noun: "protection",
            adjective: "protective",
            adverb: "protectively"
          }
        ]
      }
    },
    {
      number: "14",
      filename: "14_word_families_mcq.json",
      title: "Word Families Multiple Choice",
      type: "word_families_mcq",
      questionCount: "10 câu",
      category: "Dạng từ",
      icon: "list",
      description: "Trắc nghiệm chọn dạng từ thích hợp (Noun, Verb, Adjective, Adverb) để điền vào câu.",
      rules: [
        "10 câu trắc nghiệm kiểm tra khả năng nhận diện vị trí và chức năng ngữ pháp của từ.",
        "4 đáp án lựa chọn chính là 4 biến thể của cùng một gốc từ.",
        "Ngữ cảnh câu rõ ràng, có dấu hiệu nhận biết từ loại trước và sau chỗ trống."
      ],
      schemaSample: {
        id: "14",
        type: "word_families_mcq",
        title: "Word Families MCQ",
        description: "Choose the correct form of the word to complete each sentence.",
        questions: [
          {
            id: "1",
            text: "Solar energy is clean and causes no __________ to our planet.",
            options: ["pollute", "pollution", "polluted", "polluting"],
            correct_answer: "pollution"
          }
        ]
      }
    },
    {
      number: "15",
      filename: "15_word_formation.json",
      title: "Word Formation in Context",
      type: "word_formation",
      questionCount: "5 câu",
      category: "Dạng từ",
      icon: "key",
      description: "Tự viết dạng biến đổi chính xác của từ cho sẵn trong ngoặc để hoàn thành câu.",
      rules: [
        "5 câu tự luận biến đổi từ loại.",
        "Học sinh tự suy luận và gõ từ hoàn chỉnh (không có phương án A/B/C/D).",
        "Có phần giải thích ngữ pháp lý do chọn danh từ, tính từ hay trạng từ."
      ],
      schemaSample: {
        id: "15",
        type: "word_formation",
        title: "Word Formation",
        description: "Write the correct form of the word in brackets.",
        questions: [
          {
            id: "1",
            text: "Riding a bicycle with a helmet is much __________ than without one. (SAFE)",
            correct_answer: "safer",
            explanation: "Cần dạng so sánh hơn của tính từ safe vì có 'than'."
          }
        ]
      }
    },
    {
      number: "16",
      filename: "16_translate_sentences.json",
      title: "Sentence Translation (Vietnamese to English)",
      type: "translate_sentences",
      questionCount: "10 câu",
      category: "Dịch thuật",
      icon: "globe",
      description: "Dịch các câu giao tiếp hoặc thông điệp từ tiếng Việt sang tiếng Anh và đối chiếu đáp án mẫu.",
      rules: [
        "10 câu tiếng Việt chuẩn ngữ pháp và đời sống.",
        "Không dùng cấu trúc ngữ pháp vượt quá trần quy định của Unit (kiểm tra grammar-roadmap.md).",
        "Cung cấp bản dịch tiếng Anh mẫu tự nhiên kèm các phương án tương đương được chấp nhận."
      ],
      schemaSample: {
        id: "16",
        type: "translate_sentences",
        title: "Translate Sentences",
        description: "Translate the Vietnamese sentences into natural English.",
        questions: [
          {
            id: "1",
            vietnamese: "Chúng ta nên đội mũ bảo hiểm khi đi xe máy.",
            english_sample: "We should wear a helmet when riding a motorbike.",
            acceptable_variants: [
              "We should wear helmets when we ride motorbikes.",
              "You should put on a helmet when riding a motorbike."
            ]
          }
        ]
      }
    }
  ],

  referenceDocs: {
    "exercise-rules": {
      title: "Exercise Rules & Quality Guidelines",
      category: "Rules",
      source: ".agent/skills/skills-data-vocab-step-7-practice/reference/exercise-rules.md",
      content: `# Exercise Rules & Design Guidelines

Quy chuẩn thiết kế và biên soạn 16 dạng bài tập từ vựng tiếng Anh theo chuẩn Global Success.

## 1. Nguyên Tắc Cốt Lõi
- **Bám sát từ vựng Unit**: Mỗi bài tập phải kiểm tra trực tiếp hoặc củng cố từ vựng trong danh sách vocab.json.
- **Trần ngữ pháp (Grammar Ceiling)**: Không sử dụng cấu trúc ngữ pháp vượt quá phạm vi Unit đang học (tra cứu grammar-roadmap.md).
- **Ngữ cảnh tự nhiên (Natural Context)**: Câu văn phải phản ánh đúng cách giao tiếp của người bản ngữ, tuyệt đối tránh dịch từng chữ từ tiếng Việt (Vietlish).
- **Tính duy nhất của đáp án đúng**: Trong các câu trắc nghiệm, chỉ duy nhất 1 phương án là đúng và hợp lý nhất. 3 phương án còn lại là distractors có tính sư phạm cao nhưng dứt khoát sai trong ngữ cảnh đó.

## 2. Tiêu Chuẩn Cân Bằng Đáp Án (A/B/C/D)
- Sau khi sinh 16 file bài tập, bắt buộc chạy script:
  \`python .agent/skills/skills-data-vocab-step-7-practice/scripts/balance_mcq_options.py <exercise_dir>\`
- Phân bổ số lượng đáp án đúng phải đạt ~25% cho mỗi vị trí A, B, C, D để tránh việc học sinh đoán mò theo thói quen.`
    },
    "json-schemas": {
      title: "16 JSON Schemas Specification",
      category: "Schemas",
      source: ".agent/skills/skills-data-vocab-step-7-practice/reference/json-schemas.md",
      content: `# 16 JSON Schemas Specification

Mỗi bài tập được lưu thành 1 file JSON độc lập trong thư mục vocab/exercises/.

| STT | Tên file | Dạng câu hỏi | Số lượng câu |
|---|---|---|---|
| 01 | multiple_choice_direct.json | Trắc nghiệm trực tiếp | 10 |
| 02 | multiple_choice_sentence.json | Điền câu trắc nghiệm | 10 |
| 03 | multiple_choice_conversation.json | Hội thoại trắc nghiệm | 10 |
| 04 | pic_to_word.json | Nhìn ảnh đoán từ | 20 |
| 05 | write_english_words.json | Viết từ theo định nghĩa | 10 câu x 2 phần |
| 06 | fill_in_blanks.json | Điền từ có Word Bank | 10 |
| 07 | paragraph_fill.json | Đoạn văn cloze test | 10 chỗ trống |
| 08 | sentence_ordering.json | Sắp xếp trật tự câu | 5 |
| 09 | multiple_choice_closest.json | Từ đồng nghĩa | 5 |
| 10 | multiple_choice_opposite.json | Từ trái nghĩa | 5 |
| 11 | dictionary_entry.json | Đọc mục từ điển Oxford | 5 mục x 2 câu |
| 12 | signs_and_notices.json | Biển báo & thông báo | 10 |
| 13 | word_families_table.json | Bảng họ từ vựng | Tối đa 10 hàng |
| 14 | word_families_mcq.json | Trắc nghiệm dạng từ | 10 |
| 15 | word_formation.json | Biến đổi từ trong ngoặc | 5 |
| 16 | translate_sentences.json | Dịch câu Việt - Anh | 10 |`
    },
    "logic-checklist": {
      title: "Logic & Naturalness Checklist",
      category: "QA Checklist",
      source: ".agent/skills/skills-fix-logic-naturalness/reference/logic-naturalness-checklist.md",
      content: `# Logic & Naturalness Checklist

Bảng kiểm tra 6 nhóm lỗi logic và câu văn thiếu tự nhiên thường gặp:

1. **Nhồi nhét tính từ (Adjective Padding)**: Lạm dụng các từ như famous, intelligent, brilliant, fantastic, special, amazing... -> Cần cắt bỏ hoặc thay bằng hành động cụ thể.
2. **Collocation sai / Dịch thô**: Dịch từng chữ từ tiếng Việt sang (play skipping -> skip, do a goal -> score a goal).
3. **Logic các vế câu mâu thuẫn**: Nối các vế câu bằng and/so/but thiếu liên kết nhân quả hoặc nghịch lý hành động.
4. **Lệch tâm lý lứa tuổi**: Sử dụng giọng văn hồi tưởng của người già cho học sinh THCS (11-15 tuổi).
5. **Gán mốc lịch sử thật vào nhân vật hư cấu**: Gây hiểu lầm về mặt dữ kiện lịch sử hoặc văn hóa.
6. **Hội thoại thiếu tự nhiên**: Lời thoại đáp lại khô cứng, không giống giao tiếp đời thực.`
    },
    "quality-checks": {
      title: "Quality Checks & Coverage Rubric",
      category: "QA",
      source: ".agent/skills/skills-data-vocab-step-7-practice/reference/quality-checks.md",
      content: `# Quality Checks & Coverage Rubric

Quy trình thẩm định hai bước bắt buộc:

## Bước 1: Kiểm tra độ phủ từ vựng (Vocabulary Coverage)
Chạy script kiểm tra:
\`poetry run python3 .agent/skills/skills-data-vocab-step-7-practice/scripts/vocab_coverage_checker.py <vocab.json> <exercises_dir>\`
- **Mục tiêu đạt: ≥ 95% độ phủ**.
- Nếu dưới 95%, script sẽ in danh sách các từ chưa được sử dụng và các từ bị lạm dụng tần suất cao (≥ 10 lần).

## Bước 2: Thẩm định chuyên sâu (Final Review)
- Kiểm tra tính chuẩn xác của trường correct_answer.
- Đảm bảo mỗi câu trắc nghiệm chỉ có duy nhất 1 đáp án đúng không gây tranh cãi.
- Bài tập số 10: Không dùng tiền tố hình thức (un-, in-, dis-) làm đáp án đối lập.
- Bài tập số 11: 4 mẫu collocation phải hoàn toàn phân biệt, không thể dùng lẫn nhau.
- Bài tập số 12: Đảm bảo độ dài 4 phương án tương đương nhau.`
    }
  }
};
