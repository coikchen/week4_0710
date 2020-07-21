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
    // eslint-disable-next-line max-len
    this.user.token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    // 為了避免直接輸入products.html 網址做的安全裝置。沒有key入token，跳轉到login.html
    // if (this.user.token === '') {
    //   window.location = 'login.html';
    // }
    this.getProducts();
  },
  methods: {
    // 預設第一頁
    getProducts(page = 1) {
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
          this.tempProduct = {
            imageUrl: [],
          };
          this.isNew = true;
          $('#productModal').modal('show');
          break;
        case 'editProduct':
          // 先複製一份出來
          // this.tempProduct = Object.assign({}, item);
          this.getProducts(item.id);
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
    getProduct(id) {
      const api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/product/${id}`;
      axios.get(api)
        .then((res) => {
          this.tempProduct = res.data.data;
          $('#productModal').modal('show');
        })
        .catch((error) => {
          console.log('有錯啊!!!' + error);
        });
    },
    updateProduct() {
      let api = `https://course-ec-api.hexschool.io/${this.user.uuid}/admin/ec/product`;
      let httpMethod = 'post';
      if (!this.isNew) {
        api = `https://course-ec-api.hexschool.io/${this.user.uuid}/admin/ec/product/${this.tempProduct.id}`;
        httpMethod = 'patch';
      }
      axios.defaults.headers.common.Authorization = `Bearer ${this.user.token}`;
      axios[httpMethod](api, this.tempProduct)
        .then(() => {
          $('#productMoal').modal('hide');
          this.getProducts();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    uploadFile() {
      // 選取 DOM 中的檔案資訊
      const uploadedfile = document.querySelector('#customFile').files[0];
      console.dir(uploadedfile);
      // 轉成 Form Data
      const formData = new FormData();
      formData.append('file', uploadedfile);

      // 路由、驗證
      const url = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/storage`;
      // axios.defaults.headers.common.Authorization = `Bearer ${this.token}`;
      this.status.fileUploading = truel
      axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then((res) => {
          this.status.fileUploading = false;
          if(res.status === 200){
            this.tempProduct.imageUrl.push(res.data.data.path)
          }
          console.log(res);
        })
        .catch(() => {
          console.log('照片不能超過2MB');
          this.status.fileUploading = false;

        });
    },
    delProduct() {
      const api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/product/${this.tempProduct.id}`;
      axios.defaults.headers.common.Authorization = `Bearer ${this.user.token}`;
      axios.delete(api)
        .then(() => {
          $('#delProductModal').modal('hide');
          this.getProducts();
        })
        .catch((error)=>{
          console.log('錯了！錯了!'+ error)
        })
    },
  },
});
