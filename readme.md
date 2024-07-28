Dưới đây là một ví dụ về tệp README để giải thích về ứng dụng từ vựng của bạn:

````markdown
# Ứng Dụng Luyện Từ Vựng

Ứng dụng này giúp người dùng luyện tập từ vựng tiếng Anh và tiếng Việt thông qua các chế độ nhập liệu khác nhau. Bạn có thể chọn nhập từ vựng tiếng Việt cho từ tiếng Anh hoặc ngược lại.

## Cách Cài Đặt và Sử Dụng

### Yêu Cầu

-   Node.js (phiên bản 20.16.0 hoặc mới hơn)

### Cài Đặt

1. Clone repository này về máy của bạn:

    ```sh
    git clone <repository-url>
    cd <repository-directory>
    ```

2. Cài đặt các package cần thiết:

    ```sh
    npm install
    ```

### Chạy Ứng Dụng

Để chạy ứng dụng, sử dụng lệnh sau:

```sh
node main.js
```
````

### Hướng Dẫn Sử Dụng

Sau khi chạy ứng dụng, bạn sẽ thấy một menu với các tùy chọn:

1. **Nhập từ vựng tiếng Việt cho từ tiếng Anh**: Chọn chế độ này nếu bạn muốn nhập nghĩa tiếng Việt cho từ tiếng Anh hiển thị.
2. **Nhập từ vựng tiếng Anh cho từ tiếng Việt**: Chọn chế độ này nếu bạn muốn nhập nghĩa tiếng Anh cho từ tiếng Việt hiển thị.
3. **Thoát**: Chọn chế độ này để thoát khỏi chương trình.

### Các Tính Năng

-   **Từ vựng mặc định**: Ứng dụng đi kèm với một danh sách từ vựng mặc định. Nếu không tìm thấy tệp `vocabulary.txt`, ứng dụng sẽ tạo một tệp mới với các từ vựng mặc định.
-   **Thanh tiến trình**: Hiển thị tiến trình của bạn khi luyện tập từ vựng.
-   **Lựa chọn chế độ luyện tập**: Luyện tập bằng cách nhập nghĩa tiếng Việt cho từ tiếng Anh hoặc ngược lại.
-   **Lưu từ vựng vào tệp**: Từ vựng của bạn được lưu vào tệp `vocabulary.txt` để bạn có thể tiếp tục luyện tập sau này.

### Ví Dụ Từ Vựng Mặc Định

-   `last name=họ/danh từ, số ít`
-   `pretty=xinh đẹp/tính từ`
-   `happy=vui vẻ/tính từ`

### Cấu Trúc Tệp

-   **main.js**: Tệp chính chứa toàn bộ mã nguồn của ứng dụng.
-   **vocabulary.txt**: Tệp chứa từ vựng của bạn, sẽ được tạo nếu không tồn tại.

### Lỗi Thường Gặp

-   **RangeError: Invalid count value**: Lỗi này có thể xảy ra khi giá trị của thanh tiến trình bị tính sai. Đảm bảo bạn sử dụng mã mới nhất và không sửa đổi cấu trúc của thanh tiến trình.

### Đóng Góp

Nếu bạn muốn đóng góp vào dự án này, vui lòng fork repository, tạo nhánh mới, commit thay đổi của bạn và tạo pull request. Chúng tôi rất hoan nghênh các đóng góp từ cộng đồng!

```

Thay thế `<repository-url>` và `<repository-directory>` bằng URL và thư mục thích hợp của bạn. Bạn cũng có thể thay đổi thông tin liên hệ theo yêu cầu.
```
