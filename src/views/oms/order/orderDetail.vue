<!--http://localhost:8090/#/oms/orderDetail?id=-->
<template>
  <div class="detail-container">
    <div>
      <el-steps :active="formatStepStatus(order.status)" finish-status="success" align-center>
        <el-step title="Submit orders" :description="formatTime(order.createTime)"></el-step>
        <el-step title="Pay order" :description="formatTime(order.paymentTime)"></el-step>
        <el-step title="Platform delivery" :description="formatTime(order.deliveryTime)"></el-step>
        <el-step title="Platform delivery" :description="formatTime(order.receiveTime)"></el-step>
        <el-step title="Complete evaluation" :description="formatTime(order.commentTime)"></el-step>
      </el-steps>
    </div>
    <el-card shadow="never" style="margin-top: 15px">
      <div class="operate-container">
        <i class="el-icon-warning color-danger" style="margin-left: 20px"></i>
        <span class="color-danger">Current order status：{{order.status | formatStatus}}</span>
        <div class="operate-button-container" v-show="order.status===0">
          <el-button size="mini" @click="showUpdateReceiverDialog">Modify customer information</el-button>
          <el-button size="mini">Modify product information</el-button>
          <el-button size="mini" @click="showUpdateMoneyDialog">Modify cost information</el-button>
          <el-button size="mini" @click="showMessageDialog">send Message</el-button>
          <el-button size="mini" @click="showCloseOrderDialog">Close order</el-button>
          <el-button size="mini" @click="showMarkOrderDialog">Remark order</el-button>
        </div>
        <div class="operate-button-container" v-show="order.status===1">
          <el-button size="mini" @click="showUpdateReceiverDialog">Modify customer information</el-button>
          <el-button size="mini" @click="showMessageDialog">send Message</el-button>
          <el-button size="mini">cancel order</el-button>
          <el-button size="mini" @click="showMarkOrderDialog">Remark order</el-button>
        </div>
        <div class="operate-button-container" v-show="order.status===2||order.status===3">
          <el-button size="mini" @click="showLogisticsDialog">order tracking</el-button>
          <el-button size="mini" @click="showMessageDialog">send Message</el-button>
          <el-button size="mini" @click="showMarkOrderDialog">Remark order</el-button>
        </div>
        <div class="operate-button-container" v-show="order.status===4">
          <el-button size="mini" @click="handleDeleteOrder">Delete order</el-button>
          <el-button size="mini" @click="showMarkOrderDialog">Remark order</el-button>
        </div>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">Basic Information</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="4" class="table-cell-title">Order number</el-col>
          <el-col :span="4" class="table-cell-title">Invoice serial number</el-col>
          <el-col :span="4" class="table-cell-title">User account</el-col>
          <el-col :span="4" class="table-cell-title">Payment method</el-col>
          <el-col :span="4" class="table-cell-title">Order source</el-col>
          <el-col :span="4" class="table-cell-title">Order Type</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="table-cell">{{order.orderSn}}</el-col>
          <el-col :span="4" class="table-cell">No</el-col>
          <el-col :span="4" class="table-cell">{{order.memberUsername}}</el-col>
          <el-col :span="4" class="table-cell">{{order.payType | formatPayType}}</el-col>
          <el-col :span="4" class="table-cell">{{order.sourceType | formatSourceType}}</el-col>
          <el-col :span="4" class="table-cell">{{order.orderType | formatOrderType}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="table-cell-title">Delivery Method</el-col>
          <el-col :span="4" class="table-cell-title">Shipment number</el-col>
          <el-col :span="4" class="table-cell-title">Automatically confirm receipt time</el-col>
          <el-col :span="4" class="table-cell-title">You can get YouCoin on order</el-col>
          <el-col :span="4" class="table-cell-title">Order can get growth value</el-col>
          <el-col :span="4" class="table-cell-title">Activity information</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="table-cell">{{order.deliveryCompany | formatNull}}</el-col>
          <el-col :span="4" class="table-cell">{{order.deliverySn | formatNull}}</el-col>
          <el-col :span="4" class="table-cell">{{order.autoConfirmDay}}sky</el-col>
          <el-col :span="4" class="table-cell">{{order.integration}}</el-col>
          <el-col :span="4" class="table-cell">{{order.growth}}</el-col>
          <el-col :span="4" class="table-cell">
            <el-popover
              placement="top-start"
              title="Activity information"
              width="200"
              trigger="hover"
              :content="order.promotionInfo">
              <span slot="reference">{{order.promotionInfo | formatLongText}}</span>
            </el-popover>
          </el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">Recipient information</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="6" class="table-cell-title">Receiver</el-col>
          <el-col :span="6" class="table-cell-title">Phone number</el-col>
          <el-col :span="6" class="table-cell-title">Postal code</el-col>
          <el-col :span="6" class="table-cell-title">Shipping address</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">{{order.receiverName}}</el-col>
          <el-col :span="6" class="table-cell">{{order.receiverPhone}}</el-col>
          <el-col :span="6" class="table-cell">{{order.receiverPostCode}}</el-col>
          <el-col :span="6" class="table-cell">{{order | formatAddress}}</el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">Product information</span>
      </div>
      <el-table
        ref="orderItemTable"
        :data="order.orderItemList"
        style="width: 100%;margin-top: 20px" border>
        <el-table-column label="Product picture" width="150" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.productPic" style="height: 80px">
          </template>
        </el-table-column>
        <el-table-column label="Product name" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.productName}}</p>
            <p>Brand：{{scope.row.productBrand}}</p>
          </template>
        </el-table-column>
        <el-table-column label="Price/Item No." width="120" align="center">
          <template slot-scope="scope">
            <p>Price：$ {{scope.row.productPrice}}</p>
            <p>No.：{{scope.row.productSn}}</p>
          </template>
        </el-table-column>
        <el-table-column label="Specs" width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.productAttr | formatProductAttr}}
          </template>
        </el-table-column>
        <el-table-column label="Quantity" width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.productQuantity}}
          </template>
        </el-table-column>
        <el-table-column label="Subtotal" width="120" align="center">
          <template slot-scope="scope">
            $ {{scope.row.productPrice*scope.row.productQuantity}}
          </template>
        </el-table-column>
      </el-table>
      <div style="float: right;margin: 20px">
        Total：<span class="color-danger">${{order.totalAmount}}</span>
      </div>
      <div style="margin-top: 60px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">Cost information</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="6" class="table-cell-title">Product total</el-col>
          <el-col :span="6" class="table-cell-title">Freight</el-col>
          <el-col :span="6" class="table-cell-title">Coupon</el-col>
          <el-col :span="6" class="table-cell-title">Points deduction</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">${{order.totalAmount}}</el-col>
          <el-col :span="6" class="table-cell">${{order.freightAmount}}</el-col>
          <el-col :span="6" class="table-cell">-${{order.couponAmount}}</el-col>
          <el-col :span="6" class="table-cell">-${{order.integrationAmount}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell-title">Activity Offers</el-col>
          <el-col :span="6" class="table-cell-title">Discount amount</el-col>
          <el-col :span="6" class="table-cell-title">The total amount of orders</el-col>
          <el-col :span="6" class="table-cell-title">Amount payable</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">-${{order.promotionAmount}}</el-col>
          <el-col :span="6" class="table-cell">-${{order.discountAmount}}</el-col>
          <el-col :span="6" class="table-cell">
            <span class="color-danger">${{order.totalAmount+order.freightAmount}}</span>
          </el-col>
          <el-col :span="6" class="table-cell">
            <span class="color-danger">${{order.payAmount+order.freightAmount-order.discountAmount}}</span>
          </el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">Operation information</span>
      </div>
      <el-table style="margin-top: 20px;width: 100%"
                ref="orderHistoryTable"
                :data="order.historyList" border>
        <el-table-column label="Operator"  width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.operateMan}}
          </template>
        </el-table-column>
        <el-table-column label="Operating time"  width="160" align="center">
          <template slot-scope="scope">
            {{formatTime(scope.row.createTime)}}
          </template>
        </el-table-column>
        <el-table-column label="Order Status"  width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.orderStatus | formatStatus}}
          </template>
        </el-table-column>
        <el-table-column label="Payment status"  width="150" align="center">
          <template slot-scope="scope">
            {{scope.row.orderStatus | formatPayStatus}}
          </template>
        </el-table-column>
        <el-table-column label="Delivery status"  width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.orderStatus | formatDeliverStatus}}
          </template>
        </el-table-column>
        <el-table-column label="Notes" align="center">
          <template slot-scope="scope">
            {{scope.row.note}}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="Modify customer information"
               :visible.sync="receiverDialogVisible"
               width="40%">
      <el-form :model="receiverInfo"
               ref="receiverInfoForm"
               label-width="150px">
        <el-form-item label="Customer name：">
          <el-input v-model="receiverInfo.receiverName" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="Phone number：">
          <el-input v-model="receiverInfo.receiverPhone" style="width: 200px">
          </el-input>
        </el-form-item>
        <el-form-item label="Postal code：">
          <el-input v-model="receiverInfo.receiverPostCode" style="width: 200px">
          </el-input>
        </el-form-item>
        <el-form-item label="Your region：">
          <v-distpicker :province="receiverInfo.receiverProvince"
                        :city="receiverInfo.receiverCity"
                        :area="receiverInfo.receiverRegion"
                        @selected="onSelectRegion"></v-distpicker>
        </el-form-item>
        <el-form-item label="Address：">
          <el-input v-model="receiverInfo.receiverDetailAddress" type="textarea" rows="3">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="receiverDialogVisible = false">Cancel</el-button>
      <el-button type="primary" @click="handleUpdateReceiverInfo">Sure</el-button>
      </span>
    </el-dialog>
    <el-dialog title="Modify cost information"
               :visible.sync="moneyDialogVisible"
               width="40%">
      <div class="table-layout">
        <el-row>
          <el-col :span="6" class="table-cell-title">Commodity total</el-col>
          <el-col :span="6" class="table-cell-title">Freight</el-col>
          <el-col :span="6" class="table-cell-title">Coupon</el-col>
          <el-col :span="6" class="table-cell-title">Points deduction</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">${{order.totalAmount}}</el-col>
          <el-col :span="6" class="table-cell">
            <el-input v-model.number="moneyInfo.freightAmount" size="mini"><template slot="prepend">$</template></el-input>
          </el-col>
          <el-col :span="6" class="table-cell">-${{order.couponAmount}}</el-col>
          <el-col :span="6" class="table-cell">-${{order.integrationAmount}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell-title">Activity Offers</el-col>
          <el-col :span="6" class="table-cell-title">Discount amount</el-col>
          <el-col :span="6" class="table-cell-title">The total amount of orders</el-col>
          <el-col :span="6" class="table-cell-title">Amount payable</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">-${{order.promotionAmount}}</el-col>
          <el-col :span="6" class="table-cell">
            <el-input v-model.number="moneyInfo.discountAmount" size="mini"><template slot="prepend">-$</template></el-input>
          </el-col>
          <el-col :span="6" class="table-cell">
            <span class="color-danger">${{order.totalAmount+moneyInfo.freightAmount}}</span>
          </el-col>
          <el-col :span="6" class="table-cell">
            <span class="color-danger">${{order.payAmount+moneyInfo.freightAmount-moneyInfo.discountAmount}}</span>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
      <el-button @click="moneyDialogVisible = false">Cancel</el-button>
      <el-button type="primary" @click="handleUpdateMoneyInfo">Sure</el-button>
      </span>
    </el-dialog>
    <el-dialog title="Send Message"
               :visible.sync="messageDialogVisible"
               width="40%">
      <el-form :model="message"
               ref="receiverInfoForm"
               label-width="150px">
        <el-form-item label="Title：">
          <el-input v-model="message.title" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="Content：">
          <el-input v-model="message.content" type="textarea" rows="3">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="messageDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleSendMessage">Sure</el-button>
      </span>
    </el-dialog>
    <el-dialog title="Close order"
               :visible.sync="closeDialogVisible"
               width="40%">
      <el-form :model="closeInfo"
               label-width="150px">
        <el-form-item label="Operation notes：">
          <el-input v-model="closeInfo.note" type="textarea" rows="3">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleCloseOrder">Sure</el-button>
      </span>
    </el-dialog>
    <el-dialog title="Note order"
               :visible.sync="markOrderDialogVisible"
               width="40%">
      <el-form :model="markInfo"
               label-width="150px">
        <el-form-item label="Operation notes：">
          <el-input v-model="markInfo.note" type="textarea" rows="3">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="markOrderDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleMarkOrder">Sure</el-button>
      </span>
    </el-dialog>
    <logistics-dialog v-model="logisticsDialogVisible"></logistics-dialog>
  </div>
</template>
<script>
  import {getOrderDetail,updateReceiverInfo,updateMoneyInfo,closeOrder,updateOrderNote,deleteOrder} from '@/api/order';
  import LogisticsDialog from '@/views/oms/order/components/logisticsDialog';
  import {formatDate} from '@/utils/date';
  import VDistpicker from 'v-distpicker';
  const defaultReceiverInfo = {
    orderId:null,
    receiverName:null,
    receiverPhone:null,
    receiverPostCode:null,
    receiverDetailAddress:null,
    receiverProvince:null,
    receiverCity:null,
    receiverRegion:null,
    status:null
  };
  export default {
    name: 'orderDetail',
    components: { VDistpicker, LogisticsDialog},
    data() {
      return {
        id: null,
        order: {},
        receiverDialogVisible:false,
        receiverInfo:Object.assign({},defaultReceiverInfo),
        moneyDialogVisible:false,
        moneyInfo:{orderId:null, freightAmount:0, discountAmount:0,status:null},
        messageDialogVisible:false,
        message: {title:null, content:null},
        closeDialogVisible:false,
        closeInfo:{note:null,id:null},
        markOrderDialogVisible:false,
        markInfo:{note:null},
        logisticsDialogVisible:false
      }
    },
    created() {
      this.id = this.list = this.$route.query.id;
      getOrderDetail(this.id).then(response => {
        this.order = response.data;
      });
    },
    filters: {
      formatNull(value) {
        if(value===undefined||value===null||value===''){
          return 'No';
        }else{
          return value;
        }
      },
      formatLongText(value) {
        if(value===undefined||value===null||value===''){
          return 'No';
        }else if(value.length>8){
          return value.substr(0, 8) + '...';
        }else{
          return value;
        }
      },
      formatPayType(value) {
        if (value === 1) {
          return 'Alipay';
        } else if (value === 2) {
          return 'WeChat';
        } else {
          return 'Unpaid';
        }
      },
      formatSourceType(value) {
        if (value === 1) {
          return 'APP order';
        } else {
          return 'PC order';
        }
      },
      formatOrderType(value) {
        if (value === 1) {
          return 'Spike order';
        } else {
          return 'Normal order';
        }
      },
      formatAddress(order) {
        let str = order.receiverProvince;
        if (order.receiverCity != null) {
          str += "  " + order.receiverCity;
        }
        str += "  " + order.receiverRegion;
        str += "  " + order.receiverDetailAddress;
        return str;
      },
      formatStatus(value) {
        if (value === 1) {
          return 'To be delivered';
        } else if (value === 2) {
          return 'Shipped';
        } else if (value === 3) {
          return 'Completed';
        } else if (value === 4) {
          return 'Closed';
        } else if (value === 5) {
          return 'Invalid order';
        } else {
          return 'Pending payment';
        }
      },
      formatPayStatus(value) {
        if (value === 0) {
          return 'Unpaid';
        } else if(value===4){
          return 'Refunded';
        }else{
          return 'Paid';
        }
      },
      formatDeliverStatus(value) {
        if (value === 0||value === 1) {
          return 'Not shipped';
        } else {
          return 'Shipped';
        }
      },
      formatProductAttr(value){
        if(value==null){
          return '';
        }else{
          let attr = JSON.parse(value);
          let result='';
          for(let i=0;i<attr.length;i++){
            result+=attr[i].key;
            result+=":";
            result+=attr[i].value;
            result+=";";
          }
          return result;
        }
      }
    },
    methods: {
      onSelectRegion(data){
        this.receiverInfo.receiverProvince=data.province.value;
        this.receiverInfo.receiverCity=data.city.value;
        this.receiverInfo.receiverRegion=data.area.value;
      },
      formatTime(time) {
        if (time == null || time === '') {
          return '';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
      formatStepStatus(value) {
        if (value === 1) {
          //To be delivered
          return 2;
        } else if (value === 2) {
          //Shipped
          return 3;
        } else if (value === 3) {
          //Completed
          return 4;
        }else {
          //Pending payment, closed, unlimited orders
          return 1;
        }
      },
      showUpdateReceiverDialog(){
        this.receiverDialogVisible=true;
        this.receiverInfo={
          orderId:this.order.id,
          receiverName:this.order.receiverName,
          receiverPhone:this.order.receiverPhone,
          receiverPostCode:this.order.receiverPostCode,
          receiverDetailAddress:this.order.receiverDetailAddress,
          receiverProvince:this.order.receiverProvince,
          receiverCity:this.order.receiverCity,
          receiverRegion:this.order.receiverRegion,
          status:this.order.status
        }
      },
      handleUpdateReceiverInfo(){
        this.$confirm('Do you want to modify the receiving information?', 'Hint', {
          confirmButtonText: 'Sure',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          updateReceiverInfo(this.receiverInfo).then(response=>{
            this.receiverDialogVisible=false;
            this.$message({
              type: 'success',
              message: 'Successfully modified!'
            });
            getOrderDetail(this.id).then(response => {
              this.order = response.data;
            });
          });
        });
      },
      showUpdateMoneyDialog(){
        this.moneyDialogVisible=true;
        this.moneyInfo.orderId=this.order.id;
        this.moneyInfo.freightAmount=this.order.freightAmount;
        this.moneyInfo.discountAmount=this.order.discountAmount;
        this.moneyInfo.status=this.order.status;
      },
      handleUpdateMoneyInfo(){
        this.$confirm('Do you want to modify the cost information?', 'Hint', {
          confirmButtonText: 'Sure',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          updateMoneyInfo(this.moneyInfo).then(response=>{
            this.moneyDialogVisible=false;
            this.$message({
              type: 'success',
              message: 'Successfully modified!'
            });
            getOrderDetail(this.id).then(response => {
              this.order = response.data;
            });
          });
        });
      },
      showMessageDialog(){
        this.messageDialogVisible=true;
        this.message.title=null;
        this.message.content=null;
      },
      handleSendMessage(){
        this.$confirm('Do you want to send the station letter?', 'Hint', {
          confirmButtonText: 'Sure',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.messageDialogVisible=false;
          this.$message({
            type: 'success',
            message: 'Sent successfully!'
          });
        });
      },
      showCloseOrderDialog(){
        this.closeDialogVisible=true;
        this.closeInfo.note=null;
        this.closeInfo.id=this.id;
      },
      handleCloseOrder(){
        this.$confirm('Do you want to close?', 'Hint', {
          confirmButtonText: 'Sure',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
            let params = new URLSearchParams();
            params.append("ids",[this.closeInfo.id]);
            params.append("note",this.closeInfo.note);
            closeOrder(params).then(response=>{
              this.closeDialogVisible=false;
              this.$message({
                type: 'success',
                message: 'Order closed successfully!'
              });
              getOrderDetail(this.id).then(response => {
                this.order = response.data;
              });
            });
        });
      },
      showMarkOrderDialog(){
        this.markOrderDialogVisible=true;
        this.markInfo.id=this.id;
        this.closeOrder.note=null;
      },
      handleMarkOrder(){
        this.$confirm('Do you want to note the order?', 'Hint', {
          confirmButtonText: 'Sure',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          let params = new URLSearchParams();
          params.append("id",this.markInfo.id);
          params.append("note",this.markInfo.note);
          params.append("status",this.order.status);
          updateOrderNote(params).then(response=>{
            this.markOrderDialogVisible=false;
            this.$message({
              type: 'success',
              message: 'Order note succeeded!'
            });
            getOrderDetail(this.id).then(response => {
              this.order = response.data;
            });
          });
        });
      },
      handleDeleteOrder(){
        this.$confirm('Do you want to delete?', 'Hint', {
          confirmButtonText: 'Sure',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          let params = new URLSearchParams();
          params.append("ids",[this.id]);
          deleteOrder(params).then(response=>{
            this.$message({
              message: 'Successfully deleted！',
              type: 'success',
              duration: 1000
            });
            this.$router.back();
          });
        })
      },
      showLogisticsDialog(){
        this.logisticsDialogVisible=true;
      }
    }
  }
</script>
<style scoped>
  .detail-container {
    width: 80%;
    padding: 20px 20px 20px 20px;
    margin: 20px auto;
  }

  .operate-container {
    background: #F2F6FC;
    height: 80px;
    margin: -20px -20px 0;
    line-height: 80px;
  }

  .operate-button-container {
    float: right;
    margin-right: 20px
  }

  .table-layout {
    margin-top: 20px;
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
  }

  .table-cell {
    height: 60px;
    line-height: 40px;
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    font-size: 14px;
    color: #606266;
    text-align: center;
    overflow: hidden;
  }

  .table-cell-title {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    background: #F2F6FC;
    text-align: center;
    font-size: 14px;
    color: #303133;
  }
</style>


