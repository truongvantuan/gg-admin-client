<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>Shipping list</span>
    </el-card>
    <div class="table-container">
      <el-table ref="deliverOrderTable"
                style="width: 100%;"
                :data="list" border>
        <el-table-column label="No." width="180" align="center">
          <template slot-scope="scope">{{scope.row.orderSn}}</template>
        </el-table-column>
        <el-table-column label="Receiver" width="180" align="center">
          <template slot-scope="scope">{{scope.row.receiverName}}</template>
        </el-table-column>
        <el-table-column label="Phone number" width="160" align="center">
          <template slot-scope="scope">{{scope.row.receiverPhone}}</template>
        </el-table-column>
        <el-table-column label="Postal code" width="160" align="center">
          <template slot-scope="scope">{{scope.row.receiverPostCode}}</template>
        </el-table-column>
        <el-table-column label="Shipping address" align="center">
          <template slot-scope="scope">{{scope.row.address}}</template>
        </el-table-column>
        <el-table-column label="Delivery Method" width="160" align="center">
          <template slot-scope="scope">
            <el-select placeholder="Please choose a logistics company"
                       v-model="scope.row.deliveryCompany"
                       size="small">
              <el-option v-for="item in companyOptions"
                         :key="item"
                         :label="item"
                         :value="item">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="Shipment number" width="180" align="center">
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.deliverySn"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 15px;text-align: center">
        <el-button @click="cancel">Cancel</el-button>
        <el-button @click="confirm" type="primary">Sure</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import {deliveryOrder} from '@/api/order'
  const defaultLogisticsCompanies=["SF Express","Yuantong Express","Zhongtong Express","YunDa delivery"];
  export default {
    name: 'deliverOrderList',
    data() {
      return {
        list:[],
        companyOptions:defaultLogisticsCompanies
      }
    },
    created(){
      this.list= this.$route.query.list;
      //Convert to array when list is not an array
      if(this.list instanceof Array===false){
        this.list=[];
      }
    },
    methods:{
      cancel(){
        this.$router.back();
      },
      confirm(){
        this.$confirm('Do you want to perform shipping operations?', 'Hint', {
          confirmButtonText: 'Sure',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          deliveryOrder(this.list).then(response=>{
            this.$router.back();
            this.$message({
              type: 'success',
              message: 'Delivery is successful!'
            });
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Shipment cancelled'
          });
        });
      }
    }
  }
</script>
<style></style>


