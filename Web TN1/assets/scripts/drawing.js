// drawing.js
document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('drawingCanvas');
    const context = canvas.getContext('2d');
    const colorPicker = document.getElementById('colorPicker');
    const brushSize = document.getElementById('brushSize');
    const eraserSize = document.getElementById('eraserSize');
    const toolbar = document.getElementById('drawing-toolbar');
    const btnPen = document.getElementById('btnPen');
    const btnEraser = document.getElementById('btnEraser');
    const btnInsertImage = document.getElementById('btnInsertImage');
    const imageInput = document.getElementById('imageInput');

    let isDrawing = false;
    let isErasing = false;
    let isInsertingImage = false;

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    btnPen.addEventListener('click', () => {
        isErasing = false;
        isInsertingImage = false;
    });

    btnEraser.addEventListener('click', () => {
        isErasing = true;
        isInsertingImage = false;
    });

    btnInsertImage.addEventListener('click', () => {
        isErasing = false;
        isInsertingImage = true;
        imageInput.click(); // Mở hộp thoại chọn tệp ảnh khi nhấn nút chèn ảnh
    });

    imageInput.addEventListener('change', handleImageInsert);

    function startDrawing(e) {
        isDrawing = true;
        draw(e);
    }

    function draw(e) {
        if (!isDrawing) return;

        const size = isErasing ? eraserSize.value : brushSize.value;

        context.lineWidth = size;
        context.lineCap = 'round';
        context.strokeStyle = isErasing ? '#fff' : colorPicker.value;

        const mouseX = e.clientX - canvas.offsetLeft;
        const mouseY = e.clientY - canvas.offsetTop;

        if (isInsertingImage) {
            // Do nothing here, image insertion is handled separately
        } else {
            context.lineTo(mouseX, mouseY);
            context.stroke();
            context.beginPath();
            context.moveTo(mouseX, mouseY);
        }
    }

    function stopDrawing() {
        isDrawing = false;
        context.beginPath();
    }

    function handleImageInsert() {
        const fileInput = imageInput.files[0];

        if (fileInput) {
            const reader = new FileReader();

            reader.onload = function (e) {
                const img = new Image();
                img.onload = function () {
                    context.drawImage(img, 0, 0, img.width, img.height);
                };
                img.src = e.target.result;
            };

            reader.readAsDataURL(fileInput);
        }

        // Clear the input value to allow inserting the same image again
        imageInput.value = '';
        isInsertingImage = false;
    }
});
