new Vue({
  // 一定要綁定
  el: '#app',
  data: {
    products: [],
    pagination: {},
    tempProduct: {
      imageUrl: [],
    },
    isNew: false,
    status: {
      fileUploading: false,
    },
    user: {
      token: '',
      uuid: 'b580788b-f288-49ed-91ab-91e9bd538509',
    },
  },
  created() {
    // 寫在created 裡面，之後就不用重複寫
    this.user.token = document.cookie.replace(/(?:(?:^|.*;\s*)ajaxHomeworkToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    // ajaxHomeworkToken  TOKEN名稱 要跟著修改!!
    // 為了避免直接輸入products.html 網址做的安全裝置。沒有key入token，跳轉到login.html
    if (this.user.token === '') {
      window.location = 'login.html';
    }
    this.getProducts();
  },
  methods: {
    // 預設第一頁
    getProducts(page = 1) {
      // this.user.token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      const api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/products?page=${page}`;
      axios.defaults.headers.common.Authorization = `Bearer ${this.user.token}`;
      axios.get(api)
        .then((res) => {
          this.products = res.data.data;
          // 抓全部產品
          this.pagination = res.data.meta.pagination;
          // 抓取分頁資訊
        });
    },
    
    // 新增、修改、刪除 都是需要modal 打開 隱藏的
    // 新增，按鈕，click後開modal 塞資料進去 ≈ 編輯，打開modal 現有資料做編輯
    // 刪除，按鈕click後開modal 刪完資料要自己關閉
    // object assign 淺層拷貝！編輯、刪除會用到
    // 打開modal要做的動作，再寫update OR delete
    openModal(isNew, item) {
      switch (isNew) {
        case 'newProduct':
          this.$refs.productModal.tempProduct = {
            imageUrl: [],
          };
          this.isNew = true;
          $('#productModal').modal('show');
          break;
        case 'editProduct':
          // 先複製一份出來
          this.tempProduct = Object.assign({}, item);
          // this.getProducts(item.id);
          this.$refs.productModal.getProduct(this.tempProduct.id);
          this.isNew = false;
          // $('#productModal').modal('show');
          break;
        case 'delProduct':
          // 先複製一份出來
          this.tempProduct = Object.assign({}, item);
          $('#delProductModal').modal('show');
          break;
        // 原本沒有寫要補上
        default:
          break;
      }
    },

  
  },
});
