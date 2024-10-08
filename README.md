# Características de la Aplicación

## Características Generales

- **Visualización de Productos Destacados**: Permite a los usuarios ver los productos más destacados en la página principal, organizados por categorías.
- **Navegación por Categorías**: Los usuarios pueden explorar productos por diferentes categorías y filtrar según sus preferencias.
- **Búsqueda de Productos**: Los usuarios pueden buscar productos usando términos de búsqueda y obtener resultados relevantes basados en nombre, marca y categoría.

## Registro y Autenticación

- **Registro de Usuario**: Los usuarios pueden registrarse en la aplicación proporcionando su información personal y crear una cuenta.
- **Inicio de Sesión**: Los usuarios pueden iniciar sesión en la aplicación utilizando sus credenciales de registro.
- **Autenticación Requerida para Checkout**: Para proceder con el pago, los usuarios deben estar autenticados. Si no están autenticados, serán redirigidos a la página de inicio de sesión.

## Carrito de Compras

- **Agregar Productos al Carrito**: Los usuarios pueden añadir productos a su carrito especificando la cantidad deseada. El sistema verifica la disponibilidad de stock.
- **Visualización del Carrito**: Los usuarios pueden revisar los productos en su carrito, modificar las cantidades o eliminar productos.
- **Validación de Stock en el Carrito**: El sistema valida que haya suficiente stock antes de permitir la modificación o eliminación de productos en el carrito.

## Checkout

- **Formulario de Checkout**: Los usuarios completan un formulario para proceder con el pago. Incluye detalles de envío y pago.
- **Confirmación de Pedido**: Tras completar el formulario de checkout, los usuarios son redirigidos a una página que muestra los detalles de su pedido.

## Gestión de Usuarios por Administradores

- **Panel de Administración**: Los administradores pueden acceder a un panel para gestionar usuarios y contenido de la aplicación.
- **Desactivación de Usuarios**: Los administradores tienen la capacidad de desactivar usuarios inscritos desde el panel de administración.

## Creación de Base de Datos MySQL con Docker Compose

El proyecto utiliza Docker Compose para gestionar un contenedor MySQL con una estructura de archivos organizada de la siguiente manera: 

## Descripción de la Configuración

### Servicio `mysql_db`

```ini
mysql_db/
├── mysql_data/
└── scripts_sql/
    ├── 01_user_table.sql
    ├── 02_order_table.sql
    ├── 03_category_table.sql
    ├── 04_product_table.sql
    ├── 05_image_table.sql
    ├── 06_order_products.sql
    └── 07_triggers.sql
```

Configura el contenedor de MySQL con las siguientes opciones:

- `container_name`: Asigna el nombre del contenedor como `mysql_db`.
- `image`: Utiliza la imagen `mysql:latest` para el contenedor.
- `restart`: Configura el contenedor para reiniciarse siempre que sea necesario.
- `volumes`: Mapea dos directorios:
  - `./mysql_db/mysql_data:/var/lib/mysql`: Persistencia de datos de MySQL en el directorio local `mysql_data`.
  - `./mysql_db/scripts_sql:/docker-entrypoint-initdb.d`: Scripts SQL para inicializar la base de datos.
- `ports`: Expone el puerto 3306 en el contenedor al puerto 3306 en el host.
- `environment`: Configura las variables de entorno para MySQL:
  - `MYSQL_ROOT_PASSWORD`: Contraseña del usuario root.
  - `MYSQL_DATABASE`: Nombre de la base de datos inicial.
  - `MYSQL_USER`: Nombre del usuario de MySQL.
  - `MYSQL_PASSWORD`: Contraseña del usuario de MySQL.
- `networks`: Conecta el contenedor a la red `web_app_devices`.

### Redes y Volúmenes

- `networks`: Define una red de tipo `bridge` llamada `web_app_devices` para la comunicación entre contenedores.
- `volumes`: Define un volumen llamado `mysql_data` para la persistencia de datos.

### Scripts de Inicialización

Los archivos en `scripts_sql/` se ejecutan automáticamente durante la inicialización del contenedor MySQL. Estos scripts incluyen:

- `01_user_table.sql`: Creación de la tabla de usuarios.
- `02_order_table.sql`: Creación de la tabla de pedidos.
- `03_category_table.sql`: Creación de la tabla de categorías.
- `04_product_table.sql`: Creación de la tabla de productos.
- `05_image_table.sql`: Creación de la tabla de imágenes.
- `06_order_products.sql`: Asociación entre pedidos y productos.
- `07_triggers.sql`: Triggers para operaciones específicas en la base de datos.

- ## Relaciones de la Base de Datos

### Tablas y Relaciones

1. **Tabla `users`**
   - **user_id (CHAR(36))**: Identificador único del usuario. Es la clave primaria.
   - **email (VARCHAR(100))**: Correo electrónico del usuario, debe ser único.
   - **password (VARCHAR(200))**: Contraseña del usuario.
   - **username (VARCHAR(100))**: Nombre de usuario, debe ser único.
   - **is_admin (BOOL)**: Indica si el usuario es administrador. Valor por defecto es `FALSE`.
   - **is_active (BOOL)**: Indica si el usuario está activo. Valor por defecto es `TRUE`.
   - **register_date (TIMESTAMP)**: Fecha y hora en que el usuario se registró. Valor por defecto es la fecha y hora actual.

2. **Tabla `orders`**
   - **order_id (CHAR(36))**: Identificador único del pedido. Es la clave primaria.
   - **user_id (CHAR(36))**: Identificador del usuario que realizó el pedido. Es una clave foránea que referencia `users(user_id)`.
   - **fullname (VARCHAR(100))**: Nombre completo del destinatario.
   - **phone (VARCHAR(10))**: Número de teléfono del destinatario.
   - **address (VARCHAR(50))**: Dirección del destinatario.
   - **city (VARCHAR(50))**: Ciudad del destinatario.
   - **zip_code (VARCHAR(20))**: Código postal del destinatario.
   - **shipments (INT)**: Número de envíos.
   - **order_date (TIMESTAMP)**: Fecha y hora en que se realizó el pedido. Valor por defecto es la fecha y hora actual.
   - **quantity (INT)**: Cantidad total de productos en el pedido.
   - **total (DECIMAL(10, 2))**: Total del pedido.
   - **FOREIGN KEY (user_id)**: Referencia a `users(user_id)`. Se elimina en cascada si el usuario es eliminado.

3. **Tabla `category`**
   - **category_id (INT AUTO_INCREMENT)**: Identificador único de la categoría. Es la clave primaria.
   - **name (VARCHAR(100))**: Nombre de la categoría, debe ser único.

4. **Tabla `products`**
   - **product_id (INT AUTO_INCREMENT)**: Identificador único del producto. Es la clave primaria.
   - **name (VARCHAR(100))**: Nombre del producto, debe ser único.
   - **brand (VARCHAR(100))**: Marca del producto.
   - **price (DECIMAL(10, 2))**: Precio del producto.
   - **iva (DECIMAL(10, 2))**: Impuesto sobre el valor agregado calculado automáticamente.
   - **description (TEXT)**: Descripción del producto.
   - **ram_memory (INT)**: Memoria RAM del producto.
   - **cpu_speed (FLOAT)**: Velocidad del CPU del producto.
   - **disk_memory (INT)**: Memoria de disco del producto.
   - **stock (INT)**: Cantidad de producto en stock.
   - **is_stock (BOOL)**: Indica si el producto está en stock, calculado automáticamente.
   - **slug (VARCHAR(110))**: Identificador único para el producto en formato URL.
   - **category_id (INT)**: Identificador de la categoría del producto. Es una clave foránea que referencia `category(category_id)`. Se establece en NULL si la categoría es eliminada.

5. **Tabla `images`**
   - **image_id (INT AUTO_INCREMENT)**: Identificador único de la imagen. Es la clave primaria.
   - **color (VARCHAR(50))**: Color del producto.
   - **main_image_url (VARCHAR(300))**: URL de la imagen principal del producto.
   - **second_image_url (VARCHAR(300))**: URL de la segunda imagen del producto.
   - **third_image_url (VARCHAR(300))**: URL de la tercera imagen del producto.
   - **fourth_image_url (VARCHAR(300))**: URL de la cuarta imagen del producto.
   - **product_id (INT)**: Identificador del producto asociado. Es una clave foránea que referencia `products(product_id)`. Se establece en NULL si el producto es eliminado.

6. **Tabla `order_product`**
   - **order_product_id (INT AUTO_INCREMENT)**: Identificador único de la relación entre pedido y producto. Es la clave primaria.
   - **order_id (CHAR(36))**: Identificador del pedido. Es una clave foránea que referencia `orders(order_id)`.
   - **product_id (INT)**: Identificador del producto. Es una clave foránea que referencia `products(product_id)`.
   - **quantity (INT)**: Cantidad del producto en el pedido.
   - **UNIQUE (order_id, product_id)**: Garantiza que no se repita la combinación de pedido y producto.

## Triggers

1. **Trigger `calculate_iva`**
   - **Descripción:** Calcula el IVA del producto antes de insertar un nuevo producto en la tabla `products`.
   - **Evento:** `BEFORE INSERT`
   - **Acción:** Establece el campo `iva` como el 19% del campo `price`.

2. **Trigger `calculate_iva_update`**
   - **Descripción:** Calcula el IVA del producto antes de actualizar un producto existente en la tabla `products`.
   - **Evento:** `BEFORE UPDATE`
   - **Acción:** Establece el campo `iva` como el 19% del campo `price`.

3. **Trigger `create_is_stock_on_update`**
   - **Descripción:** Establece el campo `is_stock` en `FALSE` si el stock es menor o igual a 0 antes de insertar un nuevo producto en la tabla `products`.
   - **Evento:** `BEFORE INSERT`
   - **Acción:** Configura `is_stock` a `FALSE` si `stock` es menor o igual a 0, de lo contrario, lo establece en `TRUE`.

4. **Trigger `update_is_stock_on_update`**
   - **Descripción:** Establece el campo `is_stock` en `FALSE` si el stock es menor o igual a 0 antes de actualizar un producto existente en la tabla `products`.
   - **Evento:** `BEFORE UPDATE`
   - **Acción:** Configura `is_stock` a `FALSE` si `stock` es menor o igual a 0, de lo contrario, lo establece en `TRUE`.

## Relaciones entre Tablas

### 1. `users` y `orders`
- **Relación:** Uno a Muchos
- **Descripción:** Un usuario (`users`) puede tener múltiples pedidos (`orders`). La columna `user_id` en `orders` actúa como una clave foránea que referencia a `user_id` en `users`.

### 2. `category` y `products`
- **Relación:** Uno a Muchos
- **Descripción:** Una categoría (`category`) puede contener múltiples productos (`products`). La columna `category_id` en `products` actúa como una clave foránea que referencia a `category_id` en `category`.

### 3. `products` y `images`
- **Relación:** Uno a Uno
- **Descripción:** Un producto (`products`) tiene una única imagen (`images`). La columna `product_id` en `images` actúa como una clave foránea que referencia a `product_id` en `products` y es única.

### 4. `orders` y `order_product`
- **Relación:** Uno a Muchos
- **Descripción:** Un pedido (`orders`) puede incluir múltiples productos (`order_product`). La columna `order_id` en `order_product` actúa como una clave foránea que referencia a `order_id` en `orders`.

### 5. `products` y `order_product`
- **Relación:** Uno a Muchos
- **Descripción:** Un producto (`products`) puede estar incluido en múltiples pedidos (`order_product`). La columna `product_id` en `order_product` actúa como una clave foránea que referencia a `product_id` en `products`.

# Paso a Paso: Crear el Primer Usuario Administrador en MySQL

## 1. Verifica el Nombre del Contenedor MySQL
Primero, verifica el nombre del contenedor de MySQL para asegurarte de usar el nombre correcto.
```bash
docker ps
```
## 2. Accede al Contenedor MySQL
Accede al contenedor MySQL usando el siguiente comando:
```bash
docker exec -it mysql_db bash
```
## 3. Inicia Sesión en MySQL
Una vez dentro del contenedor, inicia sesión en MySQL con el siguiente comando. Reemplaza root y `root_password` con las credenciales de tu usuario root de MySQL.
```bash
mysql -u root -p
```
## 4. Selecciona la Base de Datos
Si tienes una base de datos específica donde quieres crear el usuario `admin`, selecciona esa base de datos:
```bash
USE kaacuna_devices_db;
```
## 5. Crea el Usuario Administrador
Ejecuta el siguiente comando para crear un usuario `admin` con el rol de administrador (`is_admin = TRUE`):
```bash
INSERT INTO users (user_id, email, password, username, is_admin, is_active)
VALUES (UUID(), 'admin@example.com', 'hash_password', 'admin', TRUE, TRUE);
```
## 6. Verifica la Creación del Usuario
Para asegurarte de que el usuario se ha creado correctamente, puedes ejecutar una consulta para ver los detalles:
```bash
SELECT * FROM users WHERE username = 'admin';
```
## 7. Sal de MySQL y del Contenedor
Para asegurarte de que el usuario se ha creado correctamente, puedes ejecutar una consulta para ver los detalles:
```bash
exit;
exit
```

## Configuración de FastAPI

La estructura del proyecto para el backend en FastAPI es la siguiente:

```ini
backend/
│
├── requirements.txt
├── app.py
├── database.py
├── images/
│   └── ... (imágenes estáticas)
├── models.py
├── requirements.txt
├── routers/
│   ├── __init__.py
│   ├── admin.py
│   ├── auth.py
│   ├── cart.py
│   ├── order.py
│   ├── products.py
│   └── user.py
└── venv/
```
1. **Create a virtual environment**:
   ```sh
   python -m venv venv
    ```
2. **Activate the virtual environment**:
   -On Windows:
     ```sh
     venv\Scripts\activate
      ```
   -On macOS/Linux:
    ```sh
     source venv/bin/activate
      ```
3. **Install the dependencies**:
   ```sh
   pip install -r requirements.txt
   ```
4.**Run FastApi**:
   ```sh
   uvicorn app:app --reload
   ```
### Descripción de los Archivos

- **`app.py`**: Archivo principal para configurar la aplicación FastAPI.
- **`database.py`**: Configuración de la base de datos y conexión.
- **`images/`**: Directorio para almacenar imágenes estáticas utilizadas en la aplicación.
- **`models.py`**: Definiciones de los modelos de datos.
- **`requirements.txt`**: Lista de dependencias del proyecto.
- **`routers/`**: Directorio para los módulos de rutas de la aplicación:
  - **`__init__.py`**: Inicializa el paquete de routers.
  - **`admin.py`**: Rutas relacionadas con la administración de usuarios y configuración.
  - **`auth.py`**: Rutas para autenticación y autorización.
  - **`cart.py`**: Rutas para el carrito de compras.
  - **`order.py`**: Rutas para el manejo de pedidos.
  - **`products.py`**: Rutas para la gestión de productos.
  - **`user.py`**: Rutas para la gestión de usuarios.
- **`venv/`**: Entorno virtual para las dependencias del proyecto.

### Configuración de la Aplicación React

#### Creación del Proyecto y Dependencias

Para crear el proyecto, utiliza el siguiente comando:

1. **Crear React App**:
   ```sh
   npx create-react-app store-web-app
    ```
2. **Instalar dependencias**:
   ```sh
   - npm install +-- axios@1.7.7
   - npm install bootstrap-icons@1.11.3
   - npm install qs@6.13.0
   - npm install react-dom@18.3.1
   - npm install react-icons@5.3.0
   - npm install react-router-dom@6.26.1
   - npm install react-scripts@5.0.1
   - npm installreact-toastify@10.0.5
   - npm install react@18.3.1
    ```
3. **Iniciar App**:
  ```sh
   npm start store-web-app
  ```
## Casos de Uso

### Caso de Uso: Administrador

#### Acceso al Panel de Administración
- **Ruta:** `/admin/`
- **Descripción:** El administrador puede acceder al panel de administración para gestionar usuarios y contenido.

#### Gestión de Usuarios
- **Descripción:** El administrador puede desactivar usuarios inscritos.
- **Ruta del Archivo:** `page/admin/files.js`
- **Acción:** En el panel de administración, el administrador puede seleccionar un usuario y desactivarlo.

### Caso de Uso: Comprador

#### Registro del Comprador
- **Ruta:** `/register/`
- **Descripción:** Un comprador se registra en el sistema proporcionando su información personal.
- **Acción:** Completa el formulario de registro y se redirige a la página de inicio de sesión.

#### Inicio de Sesión
- **Ruta:** `/login/`
- **Descripción:** Después de registrarse, el comprador inicia sesión.
- **Acción:** Ingresa credenciales y es redirigido a la página principal.

#### Página Principal
- **Ruta:** `/home/`
- **Descripción:** Muestra productos destacados y categorías.
- **Acción:** Visualiza productos y categorías disponibles.

#### Navegación por Categorías
- **Ruta:** `/categories/`
- **Descripción:** Permite al comprador ver todas las categorías.
- **Acción:** Selecciona una categoría para ver los productos asociados.

#### Agregar Productos al Carrito
- **Ruta:** `/cart/add/`
- **Descripción:** Permite al comprador agregar productos al carrito.
- **Acción:** Especifica la cantidad y agrega productos al carrito.
- **Resultado:** Muestra un mensaje de éxito o error si no hay suficiente stock.

#### Visualización y Modificación del Carrito
- **Ruta:** `/cart/`
- **Descripción:** Muestra productos en el carrito y permite modificarlos.
- **Acción:** Revisa, modifica o elimina productos del carrito.
- **Resultado:** Actualiza la cantidad y el stock en el carrito.

#### Checkout
- **Ruta:** `/checkout/`
- **Descripción:** Permite al comprador proceder con el pago.
- **Acción:** Redirige al inicio de sesión si no está autenticado. Completa el formulario de checkout.
- **Resultado:** Redirige a la página de detalles del pedido si el checkout es exitoso.

#### Visualización de Detalles del Pedido
- **Ruta:** `/order-details/{order_id}/`
- **Descripción:** Muestra los detalles del pedido realizado.
- **Acción:** Visualiza el resumen del pedido.

### Rutas en `product.py`
- `/home/`: Obtiene productos destacados y categorías.
- `/get-product/{slug}/`: Obtiene detalles de un producto por su slug.
- `/categories/`: Obtiene una lista de categorías.
- `/products/`: Obtiene todos los productos.
- `/filter-category/{category_id}/`: Filtra productos por categoría con paginación.
- `/search/`: Realiza búsqueda de productos por términos de búsqueda.

## Caso de Uso: Comprador

### 1. Registro del Comprador
- **Descripción:** Un comprador se registra en el sistema proporcionando su información personal y de contacto.
- **Acción:** El comprador completa el formulario de registro y envía sus datos.
- **Resultado Esperado:** El comprador es registrado exitosamente en el sistema y se le redirige a la página de inicio de sesión.

### 2. Inicio de Sesión
- **Ruta:** `/login/`
- **Descripción:** Después de registrarse, el comprador debe iniciar sesión en el sistema para acceder a las funcionalidades.
- **Acción:** El comprador ingresa sus credenciales en el formulario de inicio de sesión.
- **Resultado Esperado:** 
  - Si las credenciales son correctas, el comprador es autenticado y redirigido a la página principal (`/home/`).
  - Si las credenciales son incorrectas, se muestra un mensaje de error.

### 3. Página Principal
- **Ruta:** `/home/`
- **Descripción:** Muestra productos destacados y categorías disponibles.
- **Acción:** El comprador visualiza los productos ofrecidos y las categorías disponibles.
- **Resultado Esperado:** El comprador ve una lista de categorías y productos destacados.

### 4. Navegación por Categorías
- **Ruta:** `/categories/`
- **Descripción:** Permite al comprador ver todas las categorías disponibles.
- **Acción:** El comprador selecciona una categoría para ver los productos asociados.
- **Resultado Esperado:** El comprador es dirigido a una página que muestra los productos dentro de la categoría seleccionada.

### 5. Agregar Productos al Carrito
- **Ruta:** `/cart/add/`
- **Descripción:** Permite al comprador agregar productos al carrito especificando la cantidad.
- **Acción:** El comprador elige un producto, especifica la cantidad deseada y hace clic en el botón para agregar al carrito.
- **Resultado Esperado:**
  - Si hay suficiente stock, el producto se agrega al carrito y se muestra un mensaje de éxito.
  - Si no hay suficiente stock, se muestra un mensaje de error.

### 6. Visualización y Modificación del Carrito
- **Ruta:** `/cart/`
- **Descripción:** Muestra los productos en el carrito y permite modificar o eliminar productos.
- **Acción:** El comprador revisa el contenido del carrito, puede modificar las cantidades o eliminar productos.
- **Resultado Esperado:**
  - **Modificación:** El comprador puede cambiar la cantidad de un producto en el carrito y el sistema actualiza la cantidad disponible, validando el stock.
  - **Eliminación:** El comprador puede eliminar productos del carrito y el sistema actualiza el carrito en consecuencia.

### 7. Checkout
- **Ruta:** `/checkout/`
- **Descripción:** Permite al comprador proceder con el pago y finalizar la compra.
- **Acción:** El comprador hace clic en el botón de checkout en el carrito. Si no está autenticado, se le redirige al inicio de sesión.
- **Resultado Esperado:**
  - **Autenticación:** Si el comprador no está autenticado, se le redirige a la página de inicio de sesión.
  - **Autenticación Exitosa:** El comprador completa el formulario de checkout y realiza el pago. Si todo sale bien, se le redirige a la página de detalles del pedido.

### 8. Visualización de Detalles del Pedido
- **Ruta:** `/order-details/{order_id}/`
- **Descripción:** Muestra los detalles del pedido realizado por el comprador.
- **Acción:** Después de completar el checkout, el comprador es redirigido a esta ruta para ver los detalles de su pedido.
- **Resultado Esperado:** El comprador ve un resumen de su pedido, incluyendo los productos comprados, cantidades, precios y detalles de la transacción.

### Rutas en `product.py`
- `/home/`: Obtiene productos destacados con información de categorías.
- `/get-product/{slug}/`: Obtiene información detallada de un producto específico por su slug.
- `/categories/`: Obtiene una lista de todas las categorías.
- `/products/`: Obtiene una lista de todos los productos.
- `/filter-category/{category_id}/`: Filtra productos por categoría con paginación.
- `/search/`: Realiza una búsqueda de productos basada en términos de búsqueda.

### Notas Adicionales
- **Validación de Stock:** En el carrito y durante el checkout, el sistema debe validar el stock de los productos para asegurarse de que haya suficiente disponibilidad antes de permitir la compra.
- **Autenticación:** Asegúrate de que la autenticación y autorización estén correctamente implementadas para proteger las rutas de checkout y detalles del pedido.

