// ProductList.jsx
// Component for displaying list of products

import { useState, useEffect } from 'react';
import MainLayout from '../../../shared/layouts/MainLayout';
import { Card, CardContent } from '../../../shared/components/Card';
import { Button } from '../../../shared/components/Button';
import Input from '../../../shared/components/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../shared/components/Select';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '../../../shared/components/Dialog';
import { Skeleton } from '../../../shared/components/Skeleton';
import { productsApi } from '../api/productsApi';
import { useIsMobile } from '../../../shared/hooks/useIsMobile';
import ProductForm from './ProductForm';
import { Plus, Search, Package, Pencil, Trash2 } from 'lucide-react';

const CATEGORIES = ['ROPA', 'CALZADO'];

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState('todos');
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const isMobile = useIsMobile();

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await productsApi.getAll();
            setProducts(data);
        } catch (err) {
            console.error('Error loading products:', err);
            setError(err.message || 'Error al cargar productos');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddSubmit = async (data) => {
        try {
            await productsApi.create(data);
            await loadProducts();
            setIsAddDialogOpen(false);
        } catch (err) {
            console.error('Error creating product:', err);
            alert(err.message || 'Error al crear producto');
        }
    };

    const handleEditSubmit = async (data) => {
        try {
            await productsApi.update(editingProduct.id, data);
            await loadProducts();
            setEditingProduct(null);
        } catch (err) {
            console.error('Error updating product:', err);
            alert(err.message || 'Error al actualizar producto');
        }
    };

    const handleDelete = async (product) => {
        if (!confirm(`¿Estás seguro de eliminar el producto "${product.name}"?`)) {
            return;
        }
        try {
            await productsApi.delete(product.id);
            await loadProducts();
        } catch (err) {
            console.error('Error deleting product:', err);
            alert(err.message || 'Error al eliminar producto');
        }
    };

    const filteredProducts = products.filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = categoryFilter === 'todos' || p.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    if (isLoading) {
        return (
            <MainLayout>
                <div className="space-y-6 pb-20 md:pb-0">
                    <Skeleton className="h-8 w-48" />
                    <div className="grid gap-3">
                        {[...Array(5)].map((_, i) => (
                            <Card key={i}>
                                <CardContent className="p-4">
                                    <Skeleton className="h-20" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </MainLayout>
        );
    }

    if (error) {
        return (
            <MainLayout>
                <div className="space-y-6 pb-20 md:pb-0">
                    <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <p className="text-red-600 mb-4">{error}</p>
                            <Button onClick={loadProducts}>Reintentar</Button>
                        </CardContent>
                    </Card>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="space-y-6 pb-20 md:pb-0">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
                        <p className="text-gray-500 text-sm">
                            {products.length} {products.length === 1 ? 'producto' : 'productos'}
                        </p>
                    </div>

                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="h-12">
                                <Plus className="w-5 h-5 mr-2" />
                                Agregar producto
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <h2 className="text-lg font-semibold">Nuevo producto</h2>
                            </DialogHeader>
                            <ProductForm
                                onSubmit={handleAddSubmit}
                                onCancel={() => setIsAddDialogOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Buscar por nombre o SKU..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-12"
                        />
                    </div>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-full sm:w-48 h-12">
                            <SelectValue placeholder="Categoría" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todos">Todas las categorías</SelectItem>
                            {CATEGORIES.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                    {cat}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Product list */}
                {filteredProducts.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                            <Package className="w-12 h-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900">No hay productos</h3>
                            <p className="text-gray-500 mb-4">
                                {searchQuery || categoryFilter !== 'todos'
                                    ? 'No se encontraron productos con esos filtros'
                                    : 'Comienza agregando tu primer producto'}
                            </p>
                            {!searchQuery && categoryFilter === 'todos' && (
                                <Button onClick={() => setIsAddDialogOpen(true)}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Agregar producto
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : isMobile ? (
                    <div className="space-y-3">
                        {filteredProducts.map((product) => (
                            <Card key={product.id}>
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900">{product.name}</h3>
                                            <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                                            <p className="text-lg font-bold text-blue-600">S/ {parseFloat(product.price).toFixed(2)}</p>
                                            <span className={`inline-block text-xs px-2 py-1 rounded-full ${
                                                product.category === 'ROPA' 
                                                    ? 'bg-purple-100 text-purple-700' 
                                                    : 'bg-green-100 text-green-700'
                                            }`}>
                                                {product.category}
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setEditingProduct(product)}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDelete(product)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Producto</th>
                                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">SKU</th>
                                        <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Categoría</th>
                                        <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Precio</th>
                                        <th className="text-center px-4 py-3 text-sm font-medium text-gray-600">Estado</th>
                                        <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filteredProducts.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <span className="font-medium text-gray-900">{product.name}</span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-500">{product.sku}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-block text-xs px-2 py-1 rounded-full ${
                                                    product.category === 'ROPA' 
                                                        ? 'bg-purple-100 text-purple-700' 
                                                        : 'bg-green-100 text-green-700'
                                                }`}>
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right font-medium">S/ {parseFloat(product.price).toFixed(2)}</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`inline-block text-xs px-2 py-1 rounded-full ${
                                                    product.active 
                                                        ? 'bg-green-100 text-green-700' 
                                                        : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {product.active ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setEditingProduct(product)}
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDelete(product)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}

                {/* Edit Dialog */}
                {editingProduct && (
                    <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
                        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <h2 className="text-lg font-semibold">Editar producto</h2>
                            </DialogHeader>
                            <ProductForm
                                initialData={editingProduct}
                                onSubmit={handleEditSubmit}
                                onCancel={() => setEditingProduct(null)}
                            />
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </MainLayout>
    );
}
