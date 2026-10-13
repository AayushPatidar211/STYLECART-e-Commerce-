import React, { useState } from 'react';
import { ArrowLeft, Save, Sparkles, CheckCircle2 } from 'lucide-react';
import { Product, Category } from '../../types';
import { productService } from '../../services/productService';
import { adminService } from '../../services/adminService';

interface AdminProductFormPageProps {
  initialProduct?: Product | null;
  onSaveSuccess: () => void;
  onCancel: () => void;
}

export const AdminProductFormPage: React.FC<AdminProductFormPageProps> = ({
  initialProduct,
  onSaveSuccess,
  onCancel,
}) => {
  const isEdit = !!initialProduct;

  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState(initialProduct?.name || '');
  const [description, setDescription] = useState(initialProduct?.description || '');
  const [brand, setBrand] = useState(initialProduct?.brand || '');
  const [categoryId, setCategoryId] = useState<number>(initialProduct?.categoryId || 1);
  const [price, setPrice] = useState<number>(initialProduct?.price || 95.0);
  const [discountPrice, setDiscountPrice] = useState<string>(
    initialProduct?.discountPrice ? initialProduct.discountPrice.toString() : ''
  );
  const [discountPercentage, setDiscountPercentage] = useState<number>(
    initialProduct?.discountPercentage || 0
  );
  const [stockQuantity, setStockQuantity] = useState<number>(initialProduct?.stockQuantity || 30);
  const [sizesString, setSizesString] = useState<string>(
    initialProduct?.availableSizes?.join(', ') || 'S, M, L, XL'
  );
  const [colorsString, setColorsString] = useState<string>(
    initialProduct?.availableColors?.join(', ') || 'Black, Camel, Heather Grey'
  );
  const [imageUrl1, setImageUrl1] = useState(
    initialProduct?.images[0] ||
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80'
  );
  const [imageUrl2, setImageUrl2] = useState(initialProduct?.images[1] || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    adminService.getCategories().then((cats) => {
      setCategories(cats);
      if (!initialProduct && cats.length > 0) {
        setCategoryId(cats[0].id);
      }
    });
  }, [initialProduct]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const selectedCategory = categories.find((c) => c.id === Number(categoryId));
      const parsedSizes = sizesString
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const parsedColors = colorsString
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);
      const images = [imageUrl1, imageUrl2].filter((url) => Boolean(url && url.trim()));

      const productPayload = {
        name,
        description,
        brand,
        categoryId: Number(categoryId),
        categoryName: selectedCategory?.name || 'Apparel',
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : undefined,
        discountPercentage: Number(discountPercentage) || 0,
        stockQuantity: Number(stockQuantity),
        availableSizes: parsedSizes.length > 0 ? parsedSizes : ['S', 'M', 'L'],
        availableColors: parsedColors.length > 0 ? parsedColors : ['Black'],
        images: images.length > 0 ? images : [imageUrl1],
        rating: initialProduct?.rating || 4.8,
        active: true,
      };

      if (isEdit && initialProduct) {
        await productService.updateProduct(initialProduct.id, productPayload);
      } else {
        await productService.createProduct(productPayload);
      }

      onSaveSuccess();
    } catch (err: any) {
      setError(err?.message || 'Failed to save product to database');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
        <button
          onClick={onCancel}
          className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cancel & Back to Products</span>
        </button>

        <h1 className="font-serif text-xl font-bold text-neutral-900">
          {isEdit ? 'Edit Clothing Product' : 'Add New Clothing Product'}
        </h1>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 rounded-xl p-6 sm:p-8 space-y-6">
        {/* Core Attributes */}
        <div className="space-y-4">
          <h2 className="text-xs font-mono uppercase font-semibold text-neutral-500 tracking-wider">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-neutral-700 mb-1">Product Title *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Minimalist Relaxed Fit Trench Coat"
                className="w-full text-xs px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Brand Name *</label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Zara Studio"
                className="w-full text-xs px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Description & Material Story *</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Fabric composition, cut details, fit guidelines..."
              className="w-full text-xs px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Category *</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              className="w-full text-xs px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900 cursor-pointer bg-white"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="space-y-4 pt-4 border-t border-neutral-100">
          <h2 className="text-xs font-mono uppercase font-semibold text-neutral-500 tracking-wider">
            Pricing & Inventory
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Retail Price ($) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 border border-neutral-300 rounded focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Discount Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                placeholder="Optional"
                className="w-full text-xs px-3 py-2 border border-neutral-300 rounded focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Discount %</label>
              <input
                type="number"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                placeholder="0"
                className="w-full text-xs px-3 py-2 border border-neutral-300 rounded focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Stock Quantity *</label>
              <input
                type="number"
                required
                min={0}
                value={stockQuantity}
                onChange={(e) => setStockQuantity(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 border border-neutral-300 rounded focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* Variants */}
        <div className="space-y-4 pt-4 border-t border-neutral-100">
          <h2 className="text-xs font-mono uppercase font-semibold text-neutral-500 tracking-wider">
            Variants & Sizing
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Available Sizes (comma-separated)
              </label>
              <input
                type="text"
                value={sizesString}
                onChange={(e) => setSizesString(e.target.value)}
                placeholder="XS, S, M, L, XL"
                className="w-full text-xs px-3 py-2 border border-neutral-300 rounded focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Available Colors (comma-separated)
              </label>
              <input
                type="text"
                value={colorsString}
                onChange={(e) => setColorsString(e.target.value)}
                placeholder="Camel, Black, Heather Grey"
                className="w-full text-xs px-3 py-2 border border-neutral-300 rounded focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Image URLs */}
        <div className="space-y-4 pt-4 border-t border-neutral-100">
          <h2 className="text-xs font-mono uppercase font-semibold text-neutral-500 tracking-wider">
            Imagery (Primary & Secondary Angles)
          </h2>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Primary Image URL *</label>
              <input
                type="url"
                required
                value={imageUrl1}
                onChange={(e) => setImageUrl1(e.target.value)}
                placeholder="https://..."
                className="w-full text-xs px-3 py-2 border border-neutral-300 rounded focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Secondary Angle Image URL</label>
              <input
                type="url"
                value={imageUrl2}
                onChange={(e) => setImageUrl2(e.target.value)}
                placeholder="https://..."
                className="w-full text-xs px-3 py-2 border border-neutral-300 rounded focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="py-2.5 px-4 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 rounded transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="py-2.5 px-6 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-900 hover:bg-neutral-800 rounded transition-colors flex items-center gap-2 shadow-xs disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
