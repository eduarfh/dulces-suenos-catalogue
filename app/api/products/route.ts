// app/api/products/route.ts
import { NextResponse } from "next/server";
// IMPORTA el cliente server-only que creaste (supabaseAdmin).
// Asegúrate de que lib/supabase-server.ts exporte `supabaseAdmin`.
import { supabaseAdmin as supabase } from "@/lib/supabase-server";

const ALLOWED_COLUMNS = [
  "id",
  "nombre",
  "marca",
  "categoria",
  "precioMinorista",
  "precioMayorista",
  "cantidadMinimaMayorista",
  "disponible",
  "descripcion",
  "imagenURL",
] as const;
type AllowedKey = (typeof ALLOWED_COLUMNS)[number];

function cleanAndMapPayload(raw: any) {
  const out: Record<string, any> = {};
  if (!raw || typeof raw !== "object") return out;

  for (const key of ALLOWED_COLUMNS) {
    if (raw[key] !== undefined) {
      out[key] = raw[key];
    }
  }

  // Compatibilidad: `imagen` -> `imagenURL`
  if (out.imagenURL === undefined && raw.imagen !== undefined) {
    out.imagenURL = raw.imagen;
  }

  // Normalizar tipos simples
  if (out.precioMinorista !== undefined) out.precioMinorista = Number(out.precioMinorista) || 0;
  if (out.precioMayorista !== undefined) out.precioMayorista = Number(out.precioMayorista) || 0;
  if (out.cantidadMinimaMayorista !== undefined)
    out.cantidadMinimaMayorista = Number(out.cantidadMinimaMayorista) || 0;
  if (out.disponible !== undefined) out.disponible = Boolean(out.disponible);

  return out;
}

function validateProduct(clean: Record<string, any>) {
  // Validaciones mínimas. Amplía según negocio.
  if (!clean.nombre || typeof clean.nombre !== "string" || clean.nombre.trim() === "") {
    return "nombre inválido";
  }
  if (clean.precioMinorista === undefined || isNaN(Number(clean.precioMinorista))) {
    return "precioMinorista inválido";
  }
  return null;
}

/* --------------------------- GET: lista productos -------------------------- */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get("limit") ?? 100);
    const offset = Number(url.searchParams.get("offset") ?? 0);

    const selectColumns = ALLOWED_COLUMNS.join(",");

    const { data, error } = await supabase.from("Producto").select(selectColumns).range(offset, offset + limit - 1);

    if (error) {
      console.error("Error getting products from Supabase:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ products: data ?? [] }, { status: 200 });
  } catch (error) {
    console.error("Unexpected error getting products:", error);
    return NextResponse.json({ error: "Failed to get products" }, { status: 500 });
  }
}

/* --------------------------- POST: crear producto(s) ---------------------- */
export async function POST(request: Request) {
  try {
    const ct = request.headers.get("content-type") ?? "";
    if (!ct.includes("application/json")) {
      return NextResponse.json({ error: "Content-Type debe ser application/json" }, { status: 415 });
    }

    const body = await request.json();

    // Normalizar distintos formatos: { product }, { products: [...] }, producto solo
    let rawProducts: any[] = [];
    if (body?.products && Array.isArray(body.products)) {
      rawProducts = body.products;
    } else if (body?.product) {
      rawProducts = [body.product];
    } else if (Array.isArray(body)) {
      rawProducts = body;
    } else {
      rawProducts = [body];
    }

    // Limpiar y validar todos los productos
    const toInsert: Record<string, any>[] = [];
    for (const raw of rawProducts) {
      const clean = cleanAndMapPayload(raw);
      const err = validateProduct(clean);
      if (err) {
        return NextResponse.json({ error: `Producto inválido: ${err}`, item: raw }, { status: 400 });
      }
      toInsert.push(clean);
    }

    const { data, error } = await supabase
      .from("Producto")
      .insert(toInsert)
      .select(ALLOWED_COLUMNS.join(","));

    if (error) {
      console.error("Error saving product(s) to Supabase:", error);
      return NextResponse.json({ error: error.message || "Supabase insert failed" }, { status: 500 });
    }

    // Si se insertó un solo producto, devolvemos `product` (objeto).
    if (Array.isArray(data) && data.length === 1) {
      // opcional: añadir header Location
      return NextResponse.json({ success: true, product: data[0] }, { status: 201 });
    }

    // Si se insertaron varios, devolvemos `products` (array).
    return NextResponse.json({ success: true, products: data }, { status: 201 });
  } catch (error) {
    console.error("Unexpected error saving product:", error);
    return NextResponse.json({ error: "Failed to save product" }, { status: 500 });
  }
}

/* --------------------------- PUT: actualizar producto -------------------- */
export async function PUT(request: Request) {
  try {
    const ct = request.headers.get("content-type") ?? "";
    if (!ct.includes("application/json")) {
      return NextResponse.json({ error: "Content-Type debe ser application/json" }, { status: 415 });
    }

    const product = await request.json();
    if (!product?.id) {
      return NextResponse.json({ error: "El ID del producto es obligatorio" }, { status: 400 });
    }

    const clean = cleanAndMapPayload(product);
    // No permitimos actualizar id
    delete (clean as any).id;

    const validationError = validateProduct({ ...clean, nombre: clean.nombre ?? "x", precioMinorista: clean.precioMinorista ?? 0 });
    if (validationError) {
      // Nota: aquí hacemos una validación mínima, puedes adaptar según reglas de negocio
      return NextResponse.json({ error: `Validación falla: ${validationError}` }, { status: 400 });
    }

    const { data, error } = await supabase.from("Producto").update(clean).eq("id", product.id).select(ALLOWED_COLUMNS.join(","));

    if (error) {
      console.error("Error updating product in Supabase:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, product: Array.isArray(data) ? data[0] : data }, { status: 200 });
  } catch (error) {
    console.error("Unexpected error updating product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

/* --------------------------- DELETE: eliminar producto ------------------- */
export async function DELETE(request: Request) {
  try {
    const ct = request.headers.get("content-type") ?? "";
    if (!ct.includes("application/json")) {
      return NextResponse.json({ error: "Content-Type debe ser application/json" }, { status: 415 });
    }

    const payload = await request.json();
    const id = payload?.id;
    if (!id) {
      return NextResponse.json({ error: "El ID del producto es obligatorio" }, { status: 400 });
    }

    const { data, error } = await supabase.from("Producto").delete().eq("id", id).select(ALLOWED_COLUMNS.join(","));

    if (error) {
      console.error("Error deleting product from Supabase:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, product: data }, { status: 200 });
  } catch (error) {
    console.error("Unexpected error deleting product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
