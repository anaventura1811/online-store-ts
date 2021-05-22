export async function getCategories() {
  return new Promise((resolve) => {
    fetch('https://api.mercadolibre.com/sites/MLB/categories')
      .then((result) => result.json()
        .then((data) => resolve(data.results)));
  });
}

export async function getProductById(id: string) {
  try {
    const request = await fetch(`https://api.mercadolibre.com/items/${id}`);
    const requestObject = await request.json();
    return requestObject;
  } catch(error) {
    throw Error();
  }
}

export async function getProductsFromCategoryAndQuery(categoryId: string, query: string) {
  return new Promise((resolve) => {
    fetch(`https://api.mercadolibre.com/sites/MLB/search?category=${categoryId}&q=${query}`)
      .then((result) => result.json()
        .then((data) => resolve(data)));
  });
}
