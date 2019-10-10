<template>
	<div>
		<div class="row">
			<div class="menu col-md-7">
				<div class="list-group">
					<div class="list-group-item" v-for="item in menu" v-bind:key="item.id">
						<div class="row">
							<div class="col-md-2">
								<span class="badge badge-info">{{ item.category }}</span>
							</div>
							<div class="col-md-6">
								{{ item.description }}
							</div>
							<div class="col-md-2">
								{{ formatMoney(item.price) }}
							</div>
							<div class="col-md-2 text-right">
								<button class="btn btn-outline-info btn-sm" v-on:click="addItem(item)">
									<span class="fa fa-plus"></span>
								</button>
								&nbsp;
								<button class="btn btn-outline-info btn-sm" v-on:click="deleteItem(item)">
									<span class="fa fa-minus"></span>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="order col-md-5">
				<h5>Pedidos #{{ order.id }}</h5>
				<span>{{ order.date }}</span>
				<hr/>
				<div v-if="order.orderItems.length === 0" class="no-items text-center">
					<span class="fa fa-arrow-left fa-3x text-info"></span>
					<br/>
					<br/>
					<h5>Escolha os items do pedido</h5>
				</div>
				<div class="row" v-for="orderItem in order.orderItems" v-bind:key="orderItem.item.id">
					<div class="col-md-2">
						{{ orderItem.quantity }}
					</div>
					<div class="col-md-7">
						{{ orderItem.item.description }}
					</div>
					<div class="col-md-3 text-right">
						{{ formatMoney(orderItem.quantity * orderItem.item.price) }}
					</div>
				</div>
				<br/>
				<button class="btn btn-info btn-lg btn-block">Confirmar ({{ formatMoney(order.total) }})</button>
			</div>
		</div>
	</div>
</template>

<script>
import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.css";
import moment from "moment/src/moment.js";
import axios from "axios/dist/axios.js";

export default {
	name: "app",
	data() {
		return {
			menu: [],
			order: {
				id: Math.floor(Math.random() * 10000),
				date: moment().format("DD/MM/YYYY HH:mm"),
				orderItems: [],
				total: 0
			}
		};
	},
	methods: {
		formatMoney(value) {
			const formatter = new Intl.NumberFormat("pt-BR", {
				style: "currency",
				currency: "BRL"
			});
			return formatter.format(value);
		},
		addItem(item) {
			const orderItem = this.order.orderItems.find(orderItem => orderItem.item.id === item.id);
			if (!orderItem) {
				this.order.orderItems.push({
					quantity: 1,
					item
				});
			} else {
				orderItem.quantity++;
			}
			this.order.total += item.price;
		},
		deleteItem(item) {
			const orderItem = this.order.orderItems.find(orderItem => orderItem.item.id === item.id);
			if (!orderItem) return;
			if (orderItem.quantity === 1) {
				this.order.orderItems.splice(this.order.orderItems.indexOf(orderItem), 1);
			} else {
				orderItem.quantity--;
			}
			this.order.total -= item.price;
		}
	},
	created() {
		axios({
			url: "http://localhost:4000",
			method: "post",
			data: {
				query: `
					{
						items {
							id
							category
							description
							price
						}
					}

				`
			}
		}).then(result => {
			const query = result.data;
			this.menu = query.data.items;
		});
	}
};
</script>

<style>
.menu {
	padding: 30px;
}
.order {
	background-color: #F1F1F1;
	padding: 30px;
	height: 100vh;
}
.no-items {
	padding-top: 50px;
	padding-bottom: 50px;
}
</style>
