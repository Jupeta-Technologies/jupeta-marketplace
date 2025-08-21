"use client";
import React, { useState, useEffect } from 'react';
import { CreateCategory, validateCategoryData } from '@/lib/api/CreateCategoryAPI';
import { UpdateCategoryAPI, UpdateCategoryRequest, validateUpdateCategoryData } from '@/lib/api/UpdateCategoryAPI';
import { GetAllCategories, organizeCategoriesHierarchy, flattenCategories, getRootCategories } from '@/lib/api/GetAllCategoriesAPI';
import { UploadImage, validateImageFile, generateSafeFilename, processImageForLocalStorage } from '@/lib/api/UploadImageAPI';
import { CategoryResponse } from '@/types/category';
import { convertApiCategoriesToLegacy, downloadCategoryDataJson, downloadReplacementCategoryDataJson, createCategoryDataTypeScriptFile } from '@/utils/categoryDataConverter';

interface CategoryFormData {
  name: string;
  slug: string;
  description: string; // Optional in form, empty string by default
  metaTitle: string; // Optional in form, empty string by default  
  metaDescription: string; // Optional in form, empty string by default
  imageUrl: string;
  imageType: 'url' | 'upload' | 'static';
  imageFile: File | null;
  staticImagePath: string;
  categoryType: 'main' | 'sub';
  parentId: string;
  heroType: 'static' | 'component';
  heroTitle: string; // Optional in form, empty string by default
  heroSubtitle: string; // Optional in form, empty string by default
  heroImage: string; // Optional in form, empty string by default
  heroImageType: 'url' | 'upload' | 'static';
  heroImageFile: File | null;
  heroStaticImagePath: string;
  heroComponentName: string;
  heroComponentProps: string;
  displayOrder: number;
  isActive: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const CategoryManagement: React.FC = () => {
  // State management
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  
  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryResponse | null>(null);
  
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    slug: '',
    description: '',
    metaTitle: '',
    metaDescription: '',
    imageUrl: '',
    imageType: 'url',
    imageFile: null,
    staticImagePath: '',
    categoryType: 'main',
    parentId: '',
    heroType: 'static',
    heroTitle: '',
    heroSubtitle: '',
    heroImage: '',
    heroImageType: 'url',
    heroImageFile: null,
    heroStaticImagePath: '',
    heroComponentName: '',
    heroComponentProps: '{}',
    displayOrder: 0,
    isActive: true
  });

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch categories from API
  const fetchCategories = async () => {
    setIsLoadingCategories(true);
    setCategoriesError(null);
    
    try {
      const response = await GetAllCategories();
      setCategories(response || []);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      setCategoriesError(error.message || 'Failed to load categories');
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // Start editing a category
  const startEditing = (category: CategoryResponse) => {
    setIsEditing(true);
    setEditingCategory(category);
    setShowForm(true);
    
    // Parse hero data
    let heroType: 'static' | 'component' = 'static';
    let heroTitle = '';
    let heroSubtitle = '';
    let heroImage = '';
    let heroComponentName = '';
    let heroComponentProps = '{}';
    
    if (category.Hero) {
      if ('componentName' in category.Hero) {
        heroType = 'component';
        heroComponentName = category.Hero.componentName || '';
        heroComponentProps = category.Hero.props || '{}';
      } else {
        heroType = 'static';
        heroTitle = category.Hero.title || '';
        heroSubtitle = category.Hero.subtitle || '';
        heroImage = category.Hero.image || '';
      }
    }
    
    // Fill form with category data
    setFormData({
      name: category.Name,
      slug: category.Slug,
      description: category.Description,
      metaTitle: category.MetaTitle,
      metaDescription: category.MetaDescription,
      imageUrl: category.ImageUrl,
      imageType: 'url',
      imageFile: null,
      staticImagePath: '',
      categoryType: category.ParentId ? 'sub' : 'main',
      parentId: category.ParentId || '',
      heroType,
      heroTitle,
      heroSubtitle,
      heroImage,
      heroImageType: 'url',
      heroImageFile: null,
      heroStaticImagePath: '',
      heroComponentName,
      heroComponentProps,
      displayOrder: category.DisplayOrder,
      isActive: category.IsActive
    });
  };

  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
    setEditingCategory(null);
    setShowForm(false);
    setFormErrors({});
    setSubmitError(null);
    
    // Reset form
    resetForm();
  };

  // Start creating a new category
  const startCreating = () => {
    setIsEditing(false);
    setEditingCategory(null);
    setFormErrors({});
    setSubmitError(null);
    resetForm();
    setShowForm(true);
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      metaTitle: '',
      metaDescription: '',
      imageUrl: '',
      imageType: 'url',
      imageFile: null,
      staticImagePath: '',
      categoryType: 'main',
      parentId: '',
      heroType: 'static',
      heroTitle: '',
      heroSubtitle: '',
      heroImage: '',
      heroImageType: 'url',
      heroImageFile: null,
      heroStaticImagePath: '',
      heroComponentName: '',
      heroComponentProps: '{}',
      displayOrder: 0,
      isActive: true
    });
  };

  // Generate and download categoryData JSON from current categories
  const handleDownloadCategoryData = async () => {
    try {
      await downloadCategoryDataJson(categories, 'categoryData.json');
      console.log('CategoryData JSON downloaded successfully');
    } catch (error) {
      console.error('Error downloading categoryData JSON:', error);
      setSubmitError('Failed to download category data');
    }
  };

  // Generate and download TypeScript file with categoryData
  const handleDownloadTypeScriptFile = async () => {
    try {
      const tsContent = createCategoryDataTypeScriptFile(categories);
      const blob = new Blob([tsContent], { type: 'text/typescript' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'categoryData.ts';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('CategoryData TypeScript file downloaded successfully');
    } catch (error) {
      console.error('Error downloading TypeScript file:', error);
      setSubmitError('Failed to download TypeScript file');
    }
  };

  // Generate and download replacement JSON file for src/data/categoryData.json
  const handleDownloadReplacementJson = async () => {
    try {
      await downloadReplacementCategoryDataJson(categories);
      console.log('Replacement categoryData JSON downloaded successfully');
    } catch (error) {
      console.error('Error downloading replacement JSON:', error);
      setSubmitError('Failed to download replacement JSON file');
    }
  };

  // Handle form input changes
  const handleInputChange = (field: keyof CategoryFormData, value: string | number | boolean | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field-specific error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Auto-generate slug from name
    if (field === 'name' && typeof value === 'string') {
      const slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  // Handle file upload for hero image
  const handleHeroImageUpload = async (file: File, storeLocally: boolean = false) => {
    try {
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      let heroImageUrl: string;

      if (storeLocally) {
        // Use local storage processing
        heroImageUrl = await processImageForLocalStorage(file, { 
          storeLocally: true, 
          generateStaticPath: true 
        });
      } else {
        // Use server upload
        const uploadResponse = await UploadImage({ file, folder: 'heroes' });
        
        if (uploadResponse.success && uploadResponse.data) {
          heroImageUrl = uploadResponse.data.imageUrl;
        } else {
          throw new Error(uploadResponse.error || 'Failed to upload hero image');
        }
      }

      setFormData(prev => ({
        ...prev,
        heroImage: heroImageUrl,
        heroImageFile: file,
        heroImageType: storeLocally ? 'static' : 'upload'
      }));
      
    } catch (error: any) {
      console.error('Hero image upload error:', error);
      setFormErrors(prev => ({ ...prev, heroImage: error.message }));
    }
  };

  // Handle file upload for category image
  const handleImageUpload = async (file: File, storeLocally: boolean = false) => {
    try {
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      let imageUrl: string;

      if (storeLocally) {
        // Use local storage processing
        imageUrl = await processImageForLocalStorage(file, { 
          storeLocally: true, 
          generateStaticPath: true 
        });
      } else {
        // Use server upload
        const uploadResponse = await UploadImage({ file, folder: 'categories' });
        
        if (uploadResponse.success && uploadResponse.data) {
          imageUrl = uploadResponse.data.imageUrl;
        } else {
          throw new Error(uploadResponse.error || 'Failed to upload image');
        }
      }

      setFormData(prev => ({
        ...prev,
        imageUrl: imageUrl,
        imageFile: file,
        imageType: storeLocally ? 'static' : 'upload'
      }));
      
    } catch (error: any) {
      console.error('Image upload error:', error);
      setFormErrors(prev => ({ ...prev, imageUrl: error.message }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setFormErrors({});
    setSubmitError(null);

    // Validate form data
    let heroForValidation = null;
    if (formData.categoryType === 'main') {
      if (formData.heroType === 'static') {
        // Only create hero object if there's actual content
        const hasStaticContent = formData.heroTitle.trim() || 
                                formData.heroSubtitle.trim() || 
                                formData.heroImage.trim();
        
        if (hasStaticContent) {
          heroForValidation = {
            title: formData.heroTitle.trim(),
            subtitle: formData.heroSubtitle.trim(),
            image: formData.heroImage.trim(),
          };
        }
      } else if (formData.heroType === 'component') {
        // Only create hero object if component name is provided
        if (formData.heroComponentName.trim()) {
          heroForValidation = {
            componentName: formData.heroComponentName.trim(),
            props: formData.heroComponentProps || '{}',
          };
        }
      }
    }

    // Use appropriate validation based on whether we're editing or creating
    let validation;
    if (isEditing && editingCategory) {
      validation = validateUpdateCategoryData({
        Id: editingCategory.Id,
        Name: formData.name,
        Description: formData.description,
        Slug: formData.slug,
        ImageUrl: formData.imageUrl,
        ParentId: formData.categoryType === 'sub' ? formData.parentId : null,
        Hero: heroForValidation,
        MetaTitle: formData.metaTitle,
        MetaDescription: formData.metaDescription,
        DisplayOrder: formData.displayOrder,
        IsActive: formData.isActive,
      });
      
      if (validation.length > 0) {
        const fieldErrors: FormErrors = {};
        validation.forEach(error => {
          if (error.includes('name')) fieldErrors.name = error;
          if (error.includes('description')) fieldErrors.description = error;
          if (error.includes('image')) fieldErrors.imageUrl = error;
          if (error.includes('Hero title')) fieldErrors.heroTitle = error;
          if (error.includes('Hero subtitle')) fieldErrors.heroSubtitle = error;
          if (error.includes('Hero image')) fieldErrors.heroImage = error;
          if (error.includes('component')) fieldErrors.heroComponentName = error;
          if (error.includes('Meta title')) fieldErrors.metaTitle = error;
          if (error.includes('Meta description')) fieldErrors.metaDescription = error;
          if (error.includes('Parent')) fieldErrors.parentId = error;
        });
        setFormErrors(fieldErrors);
        return;
      }
    } else {
      validation = validateCategoryData({
        Name: formData.name,
        Description: formData.description,
        ImageUrl: formData.imageUrl,
        ...(formData.categoryType === 'main' && heroForValidation && {
          Hero: heroForValidation,
          MetaTitle: formData.metaTitle,
          MetaDescription: formData.metaDescription,
        }),
        ...(formData.categoryType === 'sub' && {
          ParentId: formData.parentId,
        }),
      }, formData.categoryType === 'main');

      if (!validation.isValid) {
        const fieldErrors: FormErrors = {};
        validation.errors.forEach(error => {
          if (error.includes('name')) fieldErrors.name = error;
          if (error.includes('description')) fieldErrors.description = error;
          if (error.includes('image')) fieldErrors.imageUrl = error;
          if (error.includes('Hero title')) fieldErrors.heroTitle = error;
          if (error.includes('Hero subtitle')) fieldErrors.heroSubtitle = error;
          if (error.includes('Hero image')) fieldErrors.heroImage = error;
          if (error.includes('component')) fieldErrors.heroComponentName = error;
          if (error.includes('Meta title')) fieldErrors.metaTitle = error;
          if (error.includes('Meta description')) fieldErrors.metaDescription = error;
          if (error.includes('Parent')) fieldErrors.parentId = error;
        });
        setFormErrors(fieldErrors);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Prepare hero object based on hero type
      let heroObject = null;
      if (formData.categoryType === 'main') {
        if (formData.heroType === 'static') {
          // Only create hero object if there's actual content
          const hasStaticContent = formData.heroTitle.trim() || 
                                  formData.heroSubtitle.trim() || 
                                  formData.heroImage.trim();
          
          if (hasStaticContent) {
            heroObject = {
              title: formData.heroTitle.trim(),
              subtitle: formData.heroSubtitle.trim(),
              image: formData.heroImage.trim(),
            };
          }
        } else if (formData.heroType === 'component') {
          // Only create hero object if component name is provided
          if (formData.heroComponentName.trim()) {
            heroObject = {
              componentName: formData.heroComponentName.trim(),
              props: formData.heroComponentProps || '{}',
            };
          }
        }
      }

      // Prepare API request data
      const requestData = {
        ...(isEditing && editingCategory && { Id: editingCategory.Id }),
        Name: formData.name,
        Description: formData.description,
        Slug: formData.slug,
        ParentId: formData.categoryType === 'sub' ? formData.parentId : null,
        DisplayOrder: formData.displayOrder,
        ...(formData.imageUrl && formData.imageUrl.trim() && { ImageUrl: formData.imageUrl }),
        IsActive: formData.isActive,
        // For main categories, include hero (if any) and meta fields
        ...(formData.categoryType === 'main' && {
          ...(heroObject && { Hero: heroObject }),
          MetaTitle: formData.metaTitle,
          MetaDescription: formData.metaDescription,
        }),
      };

      let response;
      if (isEditing && editingCategory) {
        response = await UpdateCategoryAPI(requestData as UpdateCategoryRequest);
      } else {
        response = await CreateCategory(requestData);
      }

      if (response.Code === "0") {
        setSubmitSuccess(true);
        setShowForm(false);
        setIsEditing(false);
        setEditingCategory(null);
        
        // Refresh categories list
        fetchCategories();
        
        // Reset form
        resetForm();

        // Hide success message after 3 seconds
        setTimeout(() => setSubmitSuccess(false), 3000);
      } else {
        throw new Error(response.Message || `Failed to ${isEditing ? 'update' : 'create'} category`);
      }
    } catch (error: any) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} category:`, error);
      setSubmitError(error.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get parent category options for subcategories
  const getParentCategoryOptions = () => {
    return categories
      .filter(cat => !cat.ParentId) // Only root-level categories
      .map(cat => ({
        id: cat.Id,
        name: cat.Name
      }));
  };

  // Static image options
  const staticImageOptions = [
    { value: '/assets/images/home_2.png', label: 'Home & Kitchen' },
    { value: '/assets/images/electronics.png', label: 'Electronics' },
    { value: '/assets/images/auto_1.png', label: 'Automotive' },
    { value: '/assets/images/fashion_1.png', label: 'Fashion' },
  ];

  return (
    <div className="category-management">
      <div className="category-management-header">
        <h1>Category Management</h1>
        <button 
          className="btn-primary"
          onClick={showForm && !isEditing ? () => setShowForm(false) : startCreating}
        >
          {showForm && !isEditing ? 'Cancel' : 'Add New Category'}
        </button>
      </div>

      {/* Success Message */}
      {submitSuccess && (
        <div className="alert alert-success">
          Category created successfully!
        </div>
      )}

      {/* Add/Edit Category Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="category-form">
          <h2>{isEditing ? 'Edit Category' : 'Add New Category'}</h2>

          {/* Category Type Selection */}
          <div className="form-group">
            <label>Category Type:</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  value="main"
                  checked={formData.categoryType === 'main'}
                  onChange={(e) => handleInputChange('categoryType', e.target.value as 'main' | 'sub')}
                />
                Main Category (with Hero Section)
              </label>
              <label>
                <input
                  type="radio"
                  value="sub"
                  checked={formData.categoryType === 'sub'}
                  onChange={(e) => handleInputChange('categoryType', e.target.value as 'main' | 'sub')}
                />
                Subcategory
              </label>
            </div>
          </div>

          {/* Parent Category (for subcategories) */}
          {formData.categoryType === 'sub' && (
            <div className="form-group">
              <label>Parent Category:</label>
              <select
                value={formData.parentId}
                onChange={(e) => handleInputChange('parentId', e.target.value)}
                required
              >
                <option value="">Select Parent Category</option>
                {getParentCategoryOptions().map(option => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
              {formErrors.parentId && <span className="error">{formErrors.parentId}</span>}
            </div>
          )}

          {/* Basic Category Info */}
          <div className="form-group">
            <label>Category Name:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
            {formErrors.name && <span className="error">{formErrors.name}</span>}
          </div>

          <div className="form-group">
            <label>Slug:</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => handleInputChange('slug', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Description (Optional):</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter category description (optional)"
            />
            {formErrors.description && <span className="error">{formErrors.description}</span>}
          </div>

          {/* Category Image */}
          <div className="form-group">
            <label>
              Category Image (Optional):
            </label>
            <div className="image-input-options">
              <label>
                <input
                  type="radio"
                  value="url"
                  checked={formData.imageType === 'url'}
                  onChange={(e) => handleInputChange('imageType', e.target.value as 'url' | 'upload' | 'static')}
                />
                Image URL
              </label>
              <label>
                <input
                  type="radio"
                  value="upload"
                  checked={formData.imageType === 'upload'}
                  onChange={(e) => handleInputChange('imageType', e.target.value as 'url' | 'upload' | 'static')}
                />
                Upload File
              </label>
              <label>
                <input
                  type="radio"
                  value="static"
                  checked={formData.imageType === 'static'}
                  onChange={(e) => handleInputChange('imageType', e.target.value as 'url' | 'upload' | 'static')}
                />
                Static Image
              </label>
            </div>

            {formData.imageType === 'url' && (
              <input
                type="url"
                placeholder="Enter image URL"
                value={formData.imageUrl}
                onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                required={false}
              />
            )}

            {formData.imageType === 'upload' && (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
                required={formData.categoryType === 'main' || false}
              />
            )}

            {formData.imageType === 'static' && (
              <select
                value={formData.imageUrl}
                onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                required={formData.categoryType === 'main' || false}
              >
                <option value="">Select static image</option>
                {staticImageOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}

            {formData.categoryType === 'sub' && (
              <small className="form-hint">
                Images are optional for subcategories. Leave empty if not needed.
              </small>
            )}

            {formErrors.imageUrl && <span className="error">{formErrors.imageUrl}</span>}
          </div>

          {/* Hero Section (only for main categories) */}
          {formData.categoryType === 'main' && (
            <>
              <h3>Hero Section</h3>
              
              {/* Hero Type Selection */}
              <div className="form-group">
                <label>Hero Type:</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      value="static"
                      checked={formData.heroType === 'static'}
                      onChange={(e) => handleInputChange('heroType', e.target.value as 'static' | 'component')}
                    />
                    Static Content (Title, Subtitle, Image)
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="component"
                      checked={formData.heroType === 'component'}
                      onChange={(e) => handleInputChange('heroType', e.target.value as 'static' | 'component')}
                    />
                    Dynamic Component
                  </label>
                </div>
              </div>

              {/* Static Hero Fields */}
              {formData.heroType === 'static' && (
                <>
                  <div className="form-group">
                    <label>Hero Title (Optional):</label>
                    <input
                      type="text"
                      value={formData.heroTitle}
                      onChange={(e) => handleInputChange('heroTitle', e.target.value)}
                      placeholder="Enter hero title (optional)"
                    />
                    {formErrors.heroTitle && <span className="error">{formErrors.heroTitle}</span>}
                  </div>

                  <div className="form-group">
                    <label>Hero Subtitle (Optional):</label>
                    <input
                      type="text"
                      value={formData.heroSubtitle}
                      onChange={(e) => handleInputChange('heroSubtitle', e.target.value)}
                      placeholder="Enter hero subtitle (optional)"
                    />
                    {formErrors.heroSubtitle && <span className="error">{formErrors.heroSubtitle}</span>}
                  </div>

                  <div className="form-group">
                    <label>Hero Image (Optional):</label>
                    
                    {/* Hero Image Type Selection */}
                    <div className="image-type-selector">
                      <label>
                        <input
                          type="radio"
                          name="heroImageType"
                          value="url"
                          checked={formData.heroImageType === 'url'}
                          onChange={(e) => handleInputChange('heroImageType', e.target.value)}
                        />
                        URL
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="heroImageType"
                          value="upload"
                          checked={formData.heroImageType === 'upload'}
                          onChange={(e) => handleInputChange('heroImageType', e.target.value)}
                        />
                        Upload to Server
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="heroImageType"
                          value="static"
                          checked={formData.heroImageType === 'static'}
                          onChange={(e) => handleInputChange('heroImageType', e.target.value)}
                        />
                        Local Assets
                      </label>
                    </div>

                    {/* Hero Image Input Fields */}
                    {formData.heroImageType === 'url' && (
                      <input
                        type="url"
                        value={formData.heroImage}
                        onChange={(e) => handleInputChange('heroImage', e.target.value)}
                        placeholder="https://example.com/hero-image.jpg"
                      />
                    )}

                    {formData.heroImageType === 'upload' && (
                      <div className="upload-options">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleHeroImageUpload(file, false);
                          }}
                        />
                        <small>Upload to server</small>
                      </div>
                    )}

                    {formData.heroImageType === 'static' && (
                      <div className="static-options">
                        <input
                          type="text"
                          value={formData.heroStaticImagePath}
                          onChange={(e) => handleInputChange('heroStaticImagePath', e.target.value)}
                          placeholder="/assets/images/hero-image.jpg"
                        />
                        <div className="upload-to-assets">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleHeroImageUpload(file, true);
                            }}
                          />
                          <small>Upload and store locally in assets/images</small>
                        </div>
                      </div>
                    )}

                    {formData.heroImage && (
                      <div className="image-preview">
                        <img src={formData.heroImage} alt="Hero preview" style={{maxWidth: '200px', maxHeight: '100px'}} />
                      </div>
                    )}
                    
                    {formErrors.heroImage && <span className="error">{formErrors.heroImage}</span>}
                  </div>
                </>
              )}

              {/* Component Hero Fields */}
              {formData.heroType === 'component' && (
                <>
                  <div className="form-group">
                    <label>Component Name:</label>
                    <input
                      type="text"
                      value={formData.heroComponentName}
                      onChange={(e) => handleInputChange('heroComponentName', e.target.value)}
                      placeholder="Enter component name (e.g., CarouselHero, AutoPromotionHero)"
                      required
                    />
                    <small className="form-hint">
                      Common components: CarouselHero, HomepageInteractiveHero, ElectronicsDynamicHero, AutoPromotionHero, PersonalizedHomepageHero
                    </small>
                    {formErrors.heroComponentName && <span className="error">{formErrors.heroComponentName}</span>}
                  </div>

                  <div className="form-group">
                    <label>Component Props (JSON):</label>
                    <textarea
                      value={formData.heroComponentProps}
                      onChange={(e) => handleInputChange('heroComponentProps', e.target.value)}
                      placeholder='{"promoCode": "DRIVEFAST", "campaignId": "summer-2025"}'
                      rows={4}
                    />
                    <small className="form-hint">Enter JSON object with props for the component. Leave empty for {} if no props needed.</small>
                    {formErrors.heroComponentProps && <span className="error">{formErrors.heroComponentProps}</span>}
                  </div>
                </>
              )}

              <h3>SEO Metadata</h3>
              
              <div className="form-group">
                <label>Meta Title (Optional):</label>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                  placeholder="Enter meta title for SEO (optional)"
                />
                {formErrors.metaTitle && <span className="error">{formErrors.metaTitle}</span>}
              </div>

              <div className="form-group">
                <label>Meta Description (Optional):</label>
                <textarea
                  value={formData.metaDescription}
                  onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                  placeholder="Enter meta description for SEO (optional)"
                />
                {formErrors.metaDescription && <span className="error">{formErrors.metaDescription}</span>}
              </div>
            </>
          )}

          {/* Submit Error */}
          {submitError && (
            <div className="alert alert-error">
              {submitError}
            </div>
          )}

          {/* Form Actions */}
          <div className="form-actions">
            <button type="submit" disabled={isSubmitting} className="btn-primary">
              {isSubmitting ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Category' : 'Create Category')}
            </button>
            <button type="button" onClick={isEditing ? cancelEditing : () => setShowForm(false)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Categories List */}
      <div className="categories-section">
        <div className="categories-header">
          <h2>Existing Categories</h2>
          <div className="categories-actions">
            <button onClick={fetchCategories} className="btn-secondary">
              Refresh
            </button>
            <button 
              onClick={handleDownloadCategoryData} 
              className="btn-secondary"
              disabled={categories.length === 0}
              title="Download categories as JSON file"
            >
              📥 Download JSON
            </button>
            <button 
              onClick={handleDownloadReplacementJson} 
              className="btn-secondary"
              disabled={categories.length === 0}
              title="Download JSON file to replace src/data/categoryData.json"
            >
              🔄 Replace Data
            </button>
            <button 
              onClick={handleDownloadTypeScriptFile} 
              className="btn-secondary"
              disabled={categories.length === 0}
              title="Download categories as TypeScript file"
            >
              📄 Download TS
            </button>
          </div>
        </div>

        {isLoadingCategories && <div className="loading">Loading categories...</div>}
        
        {categoriesError && (
          <div className="alert alert-error">
            {categoriesError}
          </div>
        )}

        {!isLoadingCategories && !categoriesError && categories.length === 0 && (
          <div className="empty-state">
            No categories found. Create your first category!
          </div>
        )}

        {!isLoadingCategories && !categoriesError && categories.length > 0 && (
          <div className="categories-tree">
            {categories.map(category => (
              <CategoryTreeItem key={category.Id} category={category} level={0} onEdit={startEditing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Component to display category tree
const CategoryTreeItem: React.FC<{
  category: CategoryResponse;
  level: number;
  onEdit?: (category: CategoryResponse) => void;
}> = ({ category, level, onEdit }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(category);
  };

  return (
    <div className={`category-tree-item level-${level}`}>
      <div className="category-item-header">
        <div className="category-main-content" onClick={() => setIsExpanded(!isExpanded)}>
          {category.Children && category.Children.length > 0 && (
            <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
              {isExpanded ? '▼' : '▶'}
            </span>
          )}
          <div className="category-info">
            <span className="category-name">{category.Name}</span>
            <span className="category-id">ID: {category.Id}</span>
            {category.Slug && <span className="category-slug">Slug: {category.Slug}</span>}
            {category.ParentId && <span className="category-parent">Parent: {category.ParentId}</span>}
            {category.Hero && (
              <span className="category-hero">
                Hero: {('componentName' in category.Hero) ? `Component (${category.Hero.componentName})` : 'Static'}
              </span>
            )}
          </div>
        </div>
        
        <div className="category-actions">
          <button 
            onClick={handleEdit}
            className="btn-action btn-edit"
            title="Edit Category"
          >
            ✏️ Edit
          </button>
          <button 
            className="btn-action btn-view"
            title="View Details"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Category details:', category);
            }}
          >
            👁️ View
          </button>
        </div>
      </div>
      
      {isExpanded && category.Children && (
        <div className="category-children">
          {category.Children.map((child: CategoryResponse) => (
            <CategoryTreeItem key={child.Id} category={child} level={level + 1} onEdit={onEdit} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
