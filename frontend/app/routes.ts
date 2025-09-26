import { type RouteConfig, index, prefix, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("menu", "routes/menu/layout.tsx", [
    index("routes/menu/dashboard/index.tsx"),
    route("user", "routes/menu/user/index.tsx"),
    route("gudang", "routes/menu/gudang/index.tsx"),
    route("produk", "routes/menu/produk/index.tsx"),
    route("stok", "routes/menu/stok/index.tsx"),
    route("customer", "routes/menu/customer/index.tsx"),
    ...prefix("hilang-barang", [
      index("routes/menu/hilang-barang/index.tsx"),
      route("create", "routes/menu/hilang-barang/form.tsx", {
        "id": "hilang-barang-form-create"
      }),
      route(":trxID", "routes/menu/hilang-barang/form.tsx", {
        "id": "hilang-barang-form-detail"
      }),
    ]),
  ])
] satisfies RouteConfig;
