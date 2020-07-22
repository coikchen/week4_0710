Vue.component('productModal', {
  // 把del剩下的都挪過來
  template: `
  <div class="modal fade" id="productModal" data-backdrop="static" tabindex="-1" role="dialog"
  aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="staticBackdropLabel">產品資訊</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="row">
        <div class="form-group col-4 ">
        <label for="category">分類</label>
        <input id="category" v-model="tempProduct.category" type="text" class="form-control"
          placeholder="請輸入分類">
      </div>
          <div class="form-group col-4">
            <label for="title">產品名稱</label>
            <input id="title" v-model="tempProduct.title" type="text" class="form-control" placeholder="請輸入標題">
          </div>
        
          <div class="form-group col-4">
            <label for="unit">單位</label>
            <input id=" title" v-model="tempProduct.unit" type="text" class="form-control" placeholder="請輸入單位">
          </div>
        </div>
        <div class="row">
          <div class="form-group col-3">
            <label for="origin_price">原價</label>
            <input id="origin_price" v-model="tempProduct.origin_price" type="number" class=" form-control"
              placeholder="請輸入原價">
          </div>
          <div class="form-group col-3">
            <label for="price">售價</label>
            <input id=" price" v-model="tempProduct.price" type="number" class=" form-control"
              placeholder="請輸入售價">
          </div>
          <div class="form-group col-3">
            <div class="form-check">
              <input id="enabled" v-model="tempProduct.enabled" class="form-check-input" type="checkbox"
                >
              <label class="form-check-label" for="enabled">是否啟用</label>
            </div>
          </div>
          <div class="form-group col-3">
          </div>
        </div>

        <div class="row">
          <div class="form-group col-6">
            <label for="content">產品內容</label>
            <input id=" content" v-model="tempProduct.content" type="text" class="form-control"
              placeholder="請輸入產品內容">
          </div>
          <div class="form-group  col-6">
            <label for="description">產品描述</label>
            <input id="description" v-model="tempProduct.description" type="text" class="form-control"
              placeholder="請輸入產品描述">
          </div>

        </div>
        <div class="row">
          <div class="form-group col-6" v-for="i in 3" :key="i + 'img'">
            <label :for="'img'+i">輸入圖片網址</label>
            <input :id="'img' + i" v-model="tempProduct.imageUrl[i-1]" type="text" class="form-control"
              placeholder="請輸入圖片連結">
          </div>
          <img class="img-flx/uid col-6" :src="tempProduct.imageUrl" alt>
          <div class="form-group">
            <label for="customFile">或上傳圖片
              <i v-if="status.fileUploading" class="fas fa-spinner fa-spin"></i>
            </label>
            <input type="file" id="customFile" ref='file' class='form-control' @change='uploadFile'>
          </div>
          <img class='img-fluid' :src="tempProduct.imageUrl[0]" alt>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
          <button type="button" class="btn btn-primary" @click="updateProduct">確認</button>
        </div>
      </div>
    </div>
  </div> 
</div>
`,
  data() {
    return {
      tempProduct: {
        imageUrl: [],
      },
    };
  },
  props: ['isNew', 'status', 'user'],
  methods: {
    getProduct(id) {
      const api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/product/${id}`;
      axios.get(api)
        .then((res) => {
          $('#productModal').modal('show');
          this.tempProduct = res.data.data;
        })
        .catch((error) => {
          console.log('有錯啊!!!' + error);
        });
    },
    updateProduct() {
      let api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/product`;
      let httpMethod = 'post';
      if (!this.isNew) {
          api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/product/${this.tempProduct.id}`;
        httpMethod = 'patch';
      }
      axios.defaults.headers.common.Authorization = `Bearer ${this.user.token}`;
      axios[httpMethod](api, this.tempProduct)
        .then(() => {
          $('#productModal').modal('hide');
          // this.$emit.getProducts();
          this.$emit('update')
        })
        .catch((error) => {
          console.log(error);
        });
    },
    uploadFile() {
      // 選取 DOM 中的檔案資訊
      // const uploadedfile = document.querySelector('#customFile').files[0];
      const uploadedfile = this.$refs.file.files[0];
      // console.dir(uploadedfile);
      // 轉成 Form Data
      const formData = new FormData();
      formData.append('file', uploadedfile);

      // 路由、驗證
      const url = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/storage`;
      // axios.defaults.headers.common.Authorization = `Bearer ${this.token}`;
      this.status.fileUploading = true;
      axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then((res) => {
          this.status.fileUploading = false;
          if (res.status === 200) {
            this.tempProduct.imageUrl.push(res.data.data.path)
          }
          // console.log(res);
        })
        .catch(() => {
          console.log('照片不能超過2MB');
          this.status.fileUploading = false;
        });
    },
  },
});