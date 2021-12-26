/*
Quy trình xây dựng
1. Render Song
2. Scroll top
3. Play/ Pause/ Seek: Key HTML Audio/ Video DOM Reference
4. CD Rotate
5. Next/ Prev
6. Random
7. Next/ Repeat when end
8. Active Song
9. Scroll active song into view
10. Play song when click on this song in list
*/
// Xây dựng 2 biến để thực hiện gọi lại sau này
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// Khai báo các biến cần sử dụng
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playList = $('.playlist');
const activeSong = $('.song.active');
const volume = $('.volume');
const mute = $('.btn-mute');
const toggleMute = $('#toggle-mute');

const app = {
    // Vị trí hiện tại đầu của mảng
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,

    songs: [
        {
            name: 'Độ Tộc 2',
            singer: 'Độ Mixi, Pháo, Phúc Du, Masew',
            path: './src/audio/song1.mp3',
            image: './src/image/img1.jpeg'
        },
        {
            name: 'Bước qua nhau',
            singer: 'Vũ',
            path: './src/audio/song2.mp3',
            image: './src/image/img2.jpeg'
        },
        {
            name: 'Yêu Anh Nhất Đời',
            singer: 'LyLy',
            path: './src/audio/song3.mp3',
            image: './src/image/img3.jpeg'
        },
        {
            name: 'Freaky Squad',
            singer: 'SpaceSpeaker Boiz',
            path: './src/audio/song4.mp3',
            image: './src/image/img4.jpeg'
        },
        {
            name: 'Sao Cũng Được',
            singer: 'Binz',
            path: './src/audio/song5.mp3',
            image: './src/image/img5.jpeg'
        },
        {
            name: 'Hoa Hồng Dại',
            singer: 'Binz, Ken Tamz, KanDy',
            path: './src/audio/song6.mp3',
            image: './src/image/img6.jpeg'
        },
        {
            name: 'Cho Tôi Lang Thang',
            singer: 'Đen, Ngọt',
            path: './src/audio/song7.mp3',
            image: './src/image/img7.jpeg'
        },
        {
            name: 'Cha',
            singer: 'MTV, Karik, Võ Trọng Phúc, Ngô Duy Khiêm, Nguyễn Quân & The Zoo',
            path: './src/audio/song8.mp3',
            image: './src/image/img8.jpeg'
        },
        {
            name: 'Nhật ký của mẹ',
            singer: 'Hiền Thục',
            path: './src/audio/song9.mp3',
            image: './src/image/img9.jpeg'
        },
        {
            name: 'Cô Độc Vương',
            singer: 'Thiên Tú',
            path: './src/audio/song10.mp3',
            image: './src/image/img10.jpeg'
        }
    ],
    // Tạo phương thức
    // Render: Render UI
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb"
                    style="background-image: url(${song.image})">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>`
        })
        playList.innerHTML = htmls.join('');
    },
    // Định nghĩa thuộc tính obj
    defineProperties: function () {
        // Đặt giá trị currentSong = song tại vị trí thứ currentIndex
        Object.defineProperty(this, 'currentSong', {
            // Getter
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },
    // Hàm xử lý sự kiện
    handleEvents: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;
        // Xử lý quay cdThumbAnimate
        const cdThumbAnimate = cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ], {
            duration: 10000, //Quay 1 vòng 10s
            iterations: Infinity, //Lặp lại vô hạn
        })
        cdThumbAnimate.pause();
        // Xử lý thu phóng cdThumb
        document.onscroll = function () {
            const scrollTop = document.documentElement.scrollTop || window.scrollY
            const newCdWidth = cdWidth - scrollTop;
            if (newCdWidth > 0) {
                cd.style.width = newCdWidth + 'px';
                cd.style.opacity = newCdWidth / cdWidth;
            } else {
                cd.style.width = 0;
                cd.style.opacity = 0;
            }
        }
        // Xử lý khi click play
        playBtn.onclick = function () {
            _this.isPlaying == true ? audio.pause() : audio.play();
        }
        // Khi bài hát được play
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }
        // Khi bài hát tạm dừng
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }
        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            /*
            Giá trị thời gian hiện tại
            Tổng giá trị thời gian bài hát
            */
            // console.log(Math.floor(audio.currentTime))
            // console.log(Math.floor(audio.duration))
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
                // console.log(progress.value);
            }
        }
        // Xử lý khi tua bài hát
        progress.onchange = function () {
            // % bài hát khi tua
            progress.onclick = function () {
                audio.pause();
                audio.play();
            }
            const seekTime = progress.value * audio.duration / 100;
            audio.currentTime = seekTime;
        }
        // Xử lý khi nextSong
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }
        // Xử lý khi prevSong
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }
        // Xử lý bật tắt randomBtn
        randomBtn.onclick = function () {
            // Đảo chiều nếu isRandom = true thì đổi sang false và ngc lại
            _this.isRandom = !_this.isRandom;
            this.classList.toggle("active", _this.isRandom);
        }
        // Xử lý bật tắt repeatBtn
        repeatBtn.onclick = function () {
            // Đảo chiều nếu isRepeat = true thì đổi sang false và ngc lại
            _this.isRepeat = !_this.isRepeat;
            this.classList.toggle("active", _this.isRepeat);
        }
        // Xử lý khi kết thúc bài hát
        audio.onended = function () {
            if (_this.isRepeat) {
                _this.render();
                _this.scrollToActiveSong();
                audio.play();
            } else {
                _this.nextSong();
                _this.render();
                _this.scrollToActiveSong();
                audio.play();
            }
        }
        // Lắng nghe sự kiện click vào playlist
        playList.onclick = function (e) {
            /*
                e.target.closest(): trả về element chính nó hoặc cha của nó
                Nếu k tìm thấy thì trả về null
            */
            const songNode = e.target.closest('.song:not(.active)');
            // console.log(e.target.closest('.song:not(.active)'));
            // console.log(e.target.closest('.song'));
            if (songNode || e.target.closest('.option')) {
                if (songNode) {
                    // console.log(songNode.getAttribute('data-index'));
                    _this.currentIndex = Number(songNode.getAttribute('data-index'));
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
                if (e.target.closest('.option')) {
                    // Code phát tiển cho phần option
                }
            }
        }
        // Xử lý mute
        mute.onclick = function () {
            audio.muted = !audio.muted;
            if (audio.muted) {
                // Khi k muted
                toggleMute.classList.remove('fa-volume-up');
                toggleMute.classList.add('fa-volume-mute');
            } else {
                // Khi muted
                toggleMute.classList.add('fa-volume-up');
                toggleMute.classList.remove('fa-volume-mute');
            }
        }
        // Xử lý volume change
        volume.onchange = function () {
            const levelVolume = volume.value / 100;
            audio.volume = levelVolume;
        }
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.background = `url('${this.currentSong.image}')`;
        cdThumb.style.backgroundSize = `contain`;
        audio.src = this.currentSong.path;
    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    randomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    scrollToActiveSong: function () {
        // Key: scrollIntoView
        $('.song.active').scrollIntoView(
            {
                block: 'center'
            }
        );
    },
    // Start: Khởi chạy ứng dụng
    start: function () {
        // Định nghĩa các thuộc tính obj
        this.defineProperties();
        // Lắng nghe xử lý các sự kiện trong DOM
        this.handleEvents();
        // Tải bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();
        // Render laylist
        this.render();
    }
}

app.start()