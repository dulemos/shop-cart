const promotions = ['SINGLE LOOK', 'DOUBLE LOOK', 'TRIPLE LOOK', 'FULL LOOK'];
const { products } = require('../src/data/products');

function getShoppingCart(ids, productsList) {
	let cartProducts = getProducts(ids);
	let productIdsAndCategories = cartProducts.map(product => {
		return {
			"name": product.name,
			"category": product.category
		}
	})
	let promotion = getPromotion(cartProducts)
	let price = getTotalPrice(cartProducts, promotion)
	return {
		"products": productIdsAndCategories,
		"promotion": promotion,
		"totalPrice": `${price.total.toFixed(2)}`,
		"discountValue": `${price.discount.toFixed(2)}`,
		"discount": `${price.percentualDiscount}%`
	};
}

let getProducts = (ids) => {
	let filteredProducts = products.filter(product => ids.includes(product.id));
	return filteredProducts
}

let getPromotion = (cartProducts) =>  {
	let countCategories = [];
	cartProducts.map(product => {
		if(!countCategories.includes(product.category)) countCategories.push(product.category);
	})
	return promotions[countCategories.length -1]
} 

let getGrossTotal = (cartProducts) => {
	let grossPrices = cartProducts.map(product => product.regularPrice);
	let grossTotal = grossPrices.reduce((total, grossPrice) => total + grossPrice, 0)
	return grossTotal
}

let getNetTotal = (cartProducts, promotion) => {
	netTotal = 0;
	for(i in cartProducts){
		let productsPromotions = cartProducts[i].promotions;
		let promoIncludeds = productsPromotions.filter(x => {if(x.looks.includes(promotion)) return x.price});
		if(promoIncludeds[0]){
			netTotal += (promoIncludeds[0]['price']);
		}else{
			netTotal += cartProducts[i].regularPrice;
		}
	}
	console.log(netTotal)

	return netTotal
}

let getDiscount = (grossTotal, netTotal) => grossTotal - netTotal;
let getPercentualDiscount = (grossTotal, discount) => ((discount * 100.00) / grossTotal).toFixed(2);

let getTotalPrice = (cartProducts, promotion) => {
	let grossTotal = getGrossTotal(cartProducts);
	let netTotal = getNetTotal(cartProducts, promotion);
	
	let discount = getDiscount(grossTotal, netTotal);
	let percentualDiscount = getPercentualDiscount(grossTotal, discount);
	
	return {
		"total": netTotal,
		"discount": discount,
		"percentualDiscount": percentualDiscount
	}
}

getShoppingCart([110, 120, 130, 140])

module.exports = { getShoppingCart };
