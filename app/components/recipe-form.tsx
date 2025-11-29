'use client';

import { useActionState, useState } from 'react';
import { createRecipe } from '@/app/actions/recipes';
import type { RecipeCategory, Difficulty } from '@/lib/types/database';

const categories: RecipeCategory[] = [
  'appetizers',
  'main-courses',
  'desserts',
  'beverages',
  'salads',
  'soups',
  'breakfast',
  'snacks',
];

const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

export function RecipeForm() {
  const [state, formAction, isPending] = useActionState(createRecipe, null);
  const [ingredientCount, setIngredientCount] = useState(3);
  const [stepCount, setStepCount] = useState(3);

  const addIngredient = () => setIngredientCount((prev) => prev + 1);
  const removeIngredient = () => setIngredientCount((prev) => Math.max(1, prev - 1));
  const addStep = () => setStepCount((prev) => prev + 1);
  const removeStep = () => setStepCount((prev) => Math.max(1, prev - 1));

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{state.error}</h3>
            </div>
          </div>
        </div>
      )}

      <input type="hidden" name="ingredientCount" value={ingredientCount} />
      <input type="hidden" name="stepCount" value={stepCount} />

      {/* Basic Information */}
      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
        
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Recipe Title *
          </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm text-gray-900"
              placeholder="e.g., Chocolate Chip Cookies"
            />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm text-gray-900"
              placeholder="Tell us about this recipe..."
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category *
            </label>
            <select
              id="category"
              name="category"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm text-gray-900"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
              Difficulty
            </label>
            <select
              id="difficulty"
              name="difficulty"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm text-gray-900"
            >
              <option value="">Select difficulty</option>
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="prepTime" className="block text-sm font-medium text-gray-700">
              Prep Time (minutes)
            </label>
            <input
              type="number"
              id="prepTime"
              name="prepTime"
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm text-gray-900"
            />
          </div>

          <div>
            <label htmlFor="cookTime" className="block text-sm font-medium text-gray-700">
              Cook Time (minutes)
            </label>
            <input
              type="number"
              id="cookTime"
              name="cookTime"
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm text-gray-900"
            />
          </div>

          <div>
            <label htmlFor="servings" className="block text-sm font-medium text-gray-700">
              Servings
            </label>
            <input
              type="number"
              id="servings"
              name="servings"
              min="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm text-gray-900"
            />
          </div>
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
            Image URL
          </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm text-gray-900"
              placeholder="https://example.com/image.jpg"
            />
        </div>
      </div>

      {/* Ingredients */}
      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Ingredients *</h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={removeIngredient}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Remove
            </button>
            <button
              type="button"
              onClick={addIngredient}
              className="text-sm text-orange-600 hover:text-orange-700"
            >
              + Add
            </button>
          </div>
        </div>

        {Array.from({ length: ingredientCount }).map((_, index) => (
          <div key={index} className="grid grid-cols-12 gap-2">
            <div className="col-span-5">
              <input
                type="text"
                name={`ingredient_${index}_name`}
                placeholder="Ingredient name"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm text-gray-900"
              />
            </div>
            <div className="col-span-3">
              <input
                type="text"
                name={`ingredient_${index}_amount`}
                placeholder="Amount"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm text-gray-900"
              />
            </div>
            <div className="col-span-4">
              <input
                type="text"
                name={`ingredient_${index}_unit`}
                placeholder="Unit (cups, tbsp, etc.)"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm text-gray-900"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Steps */}
      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Instructions *</h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={removeStep}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Remove
            </button>
            <button
              type="button"
              onClick={addStep}
              className="text-sm text-orange-600 hover:text-orange-700"
            >
              + Add
            </button>
          </div>
        </div>

        {Array.from({ length: stepCount }).map((_, index) => (
          <div key={index}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Step {index + 1}
            </label>
            <textarea
              name={`step_${index}`}
              rows={2}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm text-gray-900"
              placeholder="Enter instruction..."
            />
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Creating...' : 'Create Recipe'}
        </button>
      </div>
    </form>
  );
}

