-- Insert initial products
insert into public.products (id, name, category, price, description, stock) values
  ('00000000-0000-0000-0000-000000000001', 'Body de Algodón', 'Ropa', 15.99, 'Body suave de algodón 100% para bebés de 0-12 meses', 25),
  ('00000000-0000-0000-0000-000000000002', 'Pijama con Pies', 'Ropa', 22.50, 'Pijama cómoda con pies antideslizantes', 18),
  ('00000000-0000-0000-0000-000000000003', 'Conjunto de 3 Baberos', 'Ropa', 12.99, 'Set de baberos impermeables con diseños adorables', 30),
  ('00000000-0000-0000-0000-000000000004', 'Sonajero Musical', 'Juguetes', 8.99, 'Sonajero suave con sonidos relajantes', 40),
  ('00000000-0000-0000-0000-000000000005', 'Peluche Osito', 'Juguetes', 18.99, 'Osito de peluche hipoalergénico y lavable', 22),
  ('00000000-0000-0000-0000-000000000006', 'Gimnasio de Actividades', 'Juguetes', 45.00, 'Gimnasio con juguetes colgantes y música', 12),
  ('00000000-0000-0000-0000-000000000007', 'Biberón Anticólico', 'Alimentación', 14.99, 'Biberón con sistema anticólico de 260ml', 35),
  ('00000000-0000-0000-0000-000000000008', 'Set de Platos y Cubiertos', 'Alimentación', 19.99, 'Set completo de vajilla para bebés sin BPA', 20),
  ('00000000-0000-0000-0000-000000000009', 'Esterilizador de Biberones', 'Alimentación', 55.00, 'Esterilizador eléctrico de vapor para 6 biberones', 8),
  ('00000000-0000-0000-0000-000000000010', 'Pañales Ecológicos Pack x50', 'Higiene', 28.99, 'Pañales biodegradables talla M', 50),
  ('00000000-0000-0000-0000-000000000011', 'Toallitas Húmedas x3', 'Higiene', 11.99, 'Pack de 3 paquetes de toallitas sin alcohol', 60),
  ('00000000-0000-0000-0000-000000000012', 'Bañera Plegable', 'Higiene', 38.00, 'Bañera ergonómica plegable con termómetro', 15),
  ('00000000-0000-0000-0000-000000000013', 'Mochila Pañalera', 'Accesorios', 42.00, 'Mochila espaciosa con múltiples compartimentos', 18),
  ('00000000-0000-0000-0000-000000000014', 'Chupetes Pack x2', 'Accesorios', 9.99, 'Chupetes ortodónticos de silicona', 45),
  ('00000000-0000-0000-0000-000000000015', 'Monitor de Bebé', 'Accesorios', 89.99, 'Monitor con cámara y audio bidireccional', 10),
  ('00000000-0000-0000-0000-000000000016', 'Cuna Convertible', 'Muebles', 299.00, 'Cuna que se convierte en cama infantil', 5),
  ('00000000-0000-0000-0000-000000000017', 'Cambiador con Cajones', 'Muebles', 159.00, 'Cambiador con 3 cajones de almacenamiento', 7),
  ('00000000-0000-0000-0000-000000000018', 'Mecedora para Lactancia', 'Muebles', 189.00, 'Silla mecedora acolchada para mamá y bebé', 6)
on conflict (id) do nothing;

-- Insert placeholder images for products
insert into public.product_images (product_id, image_url, display_order) values
  ('00000000-0000-0000-0000-000000000001', '/baby-cotton-bodysuit.jpg', 0),
  ('00000000-0000-0000-0000-000000000002', '/baby-footie-pajamas.jpg', 0),
  ('00000000-0000-0000-0000-000000000003', '/baby-bibs-set.jpg', 0),
  ('00000000-0000-0000-0000-000000000004', '/baby-musical-rattle.jpg', 0),
  ('00000000-0000-0000-0000-000000000005', '/soft-teddy-bear-baby.jpg', 0),
  ('00000000-0000-0000-0000-000000000006', '/baby-activity-gym.jpg', 0),
  ('00000000-0000-0000-0000-000000000007', '/anti-colic-baby-bottle.jpg', 0),
  ('00000000-0000-0000-0000-000000000008', '/baby-plate-utensils-set.jpg', 0),
  ('00000000-0000-0000-0000-000000000009', '/bottle-sterilizer.jpg', 0),
  ('00000000-0000-0000-0000-000000000010', '/eco-baby-diapers.jpg', 0),
  ('00000000-0000-0000-0000-000000000011', '/baby-wet-wipes.jpg', 0),
  ('00000000-0000-0000-0000-000000000012', '/foldable-baby-bathtub.jpg', 0),
  ('00000000-0000-0000-0000-000000000013', '/diaper-bag-backpack.png', 0),
  ('00000000-0000-0000-0000-000000000014', '/baby-pacifiers.jpg', 0),
  ('00000000-0000-0000-0000-000000000015', '/baby-monitor-camera.jpg', 0),
  ('00000000-0000-0000-0000-000000000016', '/convertible-baby-crib.jpg', 0),
  ('00000000-0000-0000-0000-000000000017', '/baby-changing-table.jpg', 0),
  ('00000000-0000-0000-0000-000000000018', '/nursing-rocking-chair.jpg', 0)
on conflict do nothing;
