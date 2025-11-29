'use client';

import { useState } from 'react';
import { deleteRecipe } from '@/app/actions/recipes';
import { useRouter } from 'next/navigation';

interface DeleteRecipeButtonProps {
  recipeId: string;
}

export function DeleteRecipeButton({ recipeId }: DeleteRecipeButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteRecipe(recipeId);
    
    if (result?.error) {
      alert(result.error);
      setIsDeleting(false);
      setShowConfirm(false);
    }
    // If successful, redirect happens in the server action
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex-1">
          <p className="text-sm font-medium text-red-800">
            Are you sure you want to delete this recipe? This action cannot be undone.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowConfirm(false)}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100"
    >
      <svg
        className="w-4 h-4 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
      Delete Recipe
    </button>
  );
}

