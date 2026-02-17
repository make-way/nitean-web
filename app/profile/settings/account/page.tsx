'use client';

import Image from 'next/image';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { updateSingleUserFieldAction, checkUsernameUniqueAction } from '@/server/actions/user';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, AlertCircle, Camera } from 'lucide-react';
import { useUploadThing } from '@/lib/uploadthing';

export default function AccountPage() {
  const { data: session, isPending, refetch } = useSession();
  const router = useRouter();
  
  // Edit State
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSavingImage, setIsSavingImage] = useState(false);

  // Validation State for Username
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
  const [usernameMessage, setUsernameMessage] = useState('');

  useEffect(() => {
    if (!isPending && session === null) {
      router.replace('/');
    }
  }, [isPending, session, router]);

  // Debounced Username Check
  useEffect(() => {
    if (editingField !== 'Username' || !editValue) {
        setUsernameStatus('idle');
        setUsernameMessage('');
        return;
    }

    if (editValue.length < 3) {
        setUsernameStatus('invalid');
        setUsernameMessage('Username must be at least 3 characters');
        return;
    }

    if (editValue === session?.user.username) {
        setUsernameStatus('available');
        setUsernameMessage('This is your current username');
        return;
    }

    const timer = setTimeout(async () => {
      setUsernameStatus('checking');
      const res = await checkUsernameUniqueAction(editValue);
      if (res.success) {
        if (res.isUnique) {
            setUsernameStatus('available');
            setUsernameMessage('Username is available');
        } else {
            setUsernameStatus('taken');
            setUsernameMessage('Username is already taken');
        }
      } else {
        setUsernameStatus('idle');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [editValue, editingField, session?.user.username]);

  const { startUpload, isUploading: isUploadingImage } = useUploadThing('profileImage', {
    onUploadError: (error: Error) => {
      toast.error(`Upload failed: ${error.message}`);
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size locally before even showing preview
    if (file.size > 4 * 1024 * 1024) {
        toast.error('Image size must be less than 4MB');
        return;
    }

    setSelectedFile(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
  };

  const handleSaveImage = async () => {
    if (!selectedFile) return;
    setIsSavingImage(true);
    try {
        const uploadRes = await startUpload([selectedFile]);
        const url = uploadRes?.[0]?.url;

        if (url) {
            const res = await updateSingleUserFieldAction('image', url);
            if (res.success) {
                toast.success('Profile image updated successfully');
                setSelectedFile(null);
                setPreviewUrl(null);
                await refetch();
            } else {
                toast.error(res.message);
            }
        }
    } catch (error) {
        toast.error('Something went wrong during upload');
    } finally {
        setIsSavingImage(false);
    }
  };

  const handleCancelImage = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  if (isPending) return null;
  if (!session) return null;

  const handleEdit = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue || '');
  };

  const handleSave = async () => {
    if (!editingField) return;
    
    // Prevent saving if username is taken or invalid
    if (editingField === 'Username' && (usernameStatus === 'taken' || usernameStatus === 'invalid')) {
        return;
    }

    setIsUpdating(true);
    try {
      const fieldMap: Record<string, 'name' | 'username' | 'phone_number' | 'image' | 'bio'> = {
        'Display Name': 'name',
        'Username': 'username',
        'Phone Number': 'phone_number',
        'Bio': 'bio',
        'Profile Image': 'image'
      };

      const dbField = fieldMap[editingField];
      if (!dbField) return;

      const res = await updateSingleUserFieldAction(dbField, editValue);

      if (res.success) {
        toast.success(`${editingField} updated successfully`);
        setEditingField(null);
        await refetch();
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header banner */}
      <div className='relative flex h-32 items-center justify-center rounded-xl bg-linear-to-r from-blue-400 to-blue-800'>
        <p className='font-bold text-white uppercase tracking-widest'>Nitean Account</p>
      </div>

      {/* Profile header */}
      <div className='-mt-12 flex items-end justify-between px-6'>
        <div className='flex items-center gap-4'>
          <div className='relative z-10 h-24 w-24 overflow-hidden rounded-full border-4 border-gray-900 bg-gray-700 shadow-xl group/avatar'>
            <Image 
              src={previewUrl || session?.user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session?.user.username}`} 
              alt='User avatar' 
              width={96} 
              height={96} 
              className="object-cover h-full w-full"
            />
            {!previewUrl && (
                <label className='absolute inset-0 flex cursor-pointer items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover/avatar:opacity-100'>
                {isUploadingImage ? (
                    <Loader2 className='h-6 w-6 animate-spin text-white' />
                ) : (
                    <Camera className='h-6 w-6 text-white' />
                )}
                <input 
                    type='file' 
                    className='hidden' 
                    accept='image/*' 
                    onChange={handleImageUpload}
                    disabled={isUploadingImage}
                />
                </label>
            )}
          </div>

          <div className='py-6'>
            <h2 className='text-xl font-bold'>{session?.user.name}</h2>
            <span className='text-gray-400'>@{session?.user.username}</span>
          </div>
        </div>

        {previewUrl && (
            <div className='flex items-center gap-3 mb-4 animate-in fade-in slide-in-from-right-4'>
                <button 
                    onClick={handleCancelImage}
                    disabled={isSavingImage}
                    className='text-xs text-gray-400 px-3 py-1.5 transition-colors disabled:opacity-50 cursor-pointer'
                >
                    Cancel
                </button>
                <button 
                    onClick={handleSaveImage}
                    disabled={isSavingImage}
                    className='flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 disabled:opacity-50 transition-all shadow-lg shadow-blue-900/20 cursor-pointer'
                >
                    {isSavingImage ? (
                        <>
                            <Loader2 className='h-3 w-3 animate-spin' />
                            Uploading...
                        </>
                    ) : (
                        'Save New Image'
                    )}
                </button>
            </div>
        )}
      </div>

      {/* Account info card */}
      <div className='rounded-2xl border border-gray-800 p-6 text-sm backdrop-blur-sm'>
        <AccountRow 
          label='Display Name' 
          value={session?.user.name} 
          isEditing={editingField === 'Display Name'}
          editValue={editValue}
          onEdit={() => handleEdit('Display Name', session?.user.name || '')}
          onCancel={() => setEditingField(null)}
          onSave={handleSave}
          onChange={(e) => setEditValue(e.target.value)}
          isUpdating={isUpdating}
        />

        <Divider />

        <AccountRow 
          label='Username' 
          value={session.user.username} 
          isEditing={editingField === 'Username'}
          editValue={editValue}
          onEdit={() => handleEdit('Username', session?.user.username || '')}
          onCancel={() => setEditingField(null)}
          onSave={handleSave}
          onChange={(e) => setEditValue(e.target.value)}
          isUpdating={isUpdating}
          validationStatus={usernameStatus}
          validationMessage={usernameMessage}
        />

        <Divider />

        <AccountRow label='Email' value={session.user.email} />

        <Divider />

        <AccountRow 
          label='Phone Number' 
          value={session.user.phone_number || 'Not set'} 
          isEditing={editingField === 'Phone Number'}
          editValue={editValue}
          onEdit={() => handleEdit('Phone Number', session?.user.phone_number || '')}
          onCancel={() => setEditingField(null)}
          onSave={handleSave}
          onChange={(e) => setEditValue(e.target.value)}
          isUpdating={isUpdating}
        />

        <Divider />

        <AccountRow 
          label='Bio' 
          value={session.user.bio || 'Add a bio...'} 
          isEditing={editingField === 'Bio'}
          editValue={editValue}
          onEdit={() => handleEdit('Bio', session?.user.bio || '')}
          onCancel={() => setEditingField(null)}
          onSave={handleSave}
          onChange={(e: any) => setEditValue(e.target.value)}
          isUpdating={isUpdating}
          isMultiline
        />
      </div>
    </div>
  );
}

/* ---------- Components ---------- */

function AccountRow({
  label,
  value,
  isEditing,
  editValue,
  onEdit,
  onCancel,
  onSave,
  onChange,
  isUpdating,
  validationStatus,
  validationMessage,
  isMultiline,
}: {
  label: string;
  value?: string;
  isEditing?: boolean;
  editValue?: string;
  onEdit?: () => void;
  onCancel?: () => void;
  onSave?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUpdating?: boolean;
  validationStatus?: 'idle' | 'checking' | 'available' | 'taken' | 'invalid';
  validationMessage?: string;
  isMultiline?: boolean;
}) {
  return (
    <div className='flex items-center justify-between py-4 group'>
      <div className="flex-1 mr-4">
        <p className='text-xs font-medium text-gray-300 uppercase tracking-wider mb-1'>{label}</p>
        {isEditing ? (
          <div className="space-y-2">
            <div className="relative">
                {isMultiline ? (
                    <textarea
                        value={editValue}
                        onChange={onChange as any}
                        rows={3}
                        className={`w-full bg-gray-800 border rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 transition-all border-blue-500/50 focus:ring-blue-500/20`}
                        autoFocus
                    />
                ) : (
                    <input
                        type="text"
                        value={editValue}
                        onChange={onChange}
                        className={`w-full bg-gray-800 border rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 transition-all ${
                            validationStatus === 'available' ? 'border-green-500/50 focus:ring-green-500/20' : 
                            (validationStatus === 'taken' || validationStatus === 'invalid') ? 'border-red-500/50 focus:ring-red-500/20' : 
                            'border-blue-500/50 focus:ring-blue-500/20'
                        }`}
                        autoFocus
                    />
                )}
                {validationStatus === 'checking' && (
                    <div className="absolute right-3 top-2.5">
                        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    </div>
                )}
            </div>
            
            {validationMessage && (
                <div className={`flex items-center gap-1.5 text-xs font-medium ${
                    validationStatus === 'available' ? 'text-green-400' : 
                    (validationStatus === 'taken' || validationStatus === 'invalid') ? 'text-red-400' : 
                    'text-gray-400'
                }`}>
                    {validationStatus === 'available' && <CheckCircle2 className="h-3 w-3" />}
                    {(validationStatus === 'taken' || validationStatus === 'invalid') && <AlertCircle className="h-3 w-3" />}
                    {validationMessage}
                </div>
            )}
          </div>
        ) : (
          <p className={`text-gray-500 font-medium ${isMultiline ? 'whitespace-pre-wrap' : ''}`}>
            {value}
          </p>
        )}
      </div>

      <div className='flex items-center gap-2'>
        {isEditing ? (
          <>
            <button 
              onClick={onCancel}
              disabled={isUpdating}
              className='text-xs text-gray-400 px-3 py-1.5 transition-colors disabled:opacity-50 cursor-pointer'
            >
              Cancel
            </button>
            <button 
              onClick={onSave}
              disabled={isUpdating || validationStatus === 'checking' || validationStatus === 'taken' || validationStatus === 'invalid'}
              className='rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 disabled:opacity-50 transition-all shadow-lg shadow-blue-900/20 cursor-pointer'
            >
              {isUpdating ? 'Saving...' : 'Save'}
            </button>
          </>
        ) : (
          onEdit && (
            <button 
              onClick={onEdit}
              className='rounded-lg bg-gray-800 px-4 py-1.5 text-xs font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-all border border-gray-700 cursor-pointer'
            >
              Edit
            </button>
          )
        )}
      </div>
    </div>
  );
}

function Divider() {
  return <div className='h-px bg-gray-800/50' />;
}
