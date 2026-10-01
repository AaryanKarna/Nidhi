import React, { useState, useEffect } from 'react';
import { 
  SavedLink, 
  Category, 
  ActiveScreen 
} from './types';
import { 
  getStoredLinks, 
  storeLinks, 
  getStoredCategories, 
  storeCategories, 
  hasCompletedFirstLaunch, 
  setFirstLaunchCompleted 
} from './storage/asyncStorage';
import { normalizeUrl, extractDomain, detectService, generateSuggestedTitle } from './utils/urlUtils';
import { ThemeProvider, useTheme } from './theme/ThemeContext';
import { Toast } from './components/common/Toast';
import { ConfirmDialog } from './components/common/ConfirmDialog';

// Screens
import { SplashScreen } from './screens/SplashScreen';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { HomeScreen } from './screens/HomeScreen';
import { LinksScreen } from './screens/LinksScreen';
import { AddLinkScreen } from './screens/AddLinkScreen';
import { LinkDetailsScreen } from './screens/LinkDetailsScreen';
import { EditLinkScreen } from './screens/EditLinkScreen';
import { CategoryDetailScreen } from './screens/CategoryDetailScreen';
import { SearchScreen } from './screens/SearchScreen';

function NidhiApp() {
  const { isDark, deviceFrame } = useTheme();

  // Navigation State: Displays the onboarding screen first on entry as requested
  const [screen, setScreen] = useState<ActiveScreen>('welcome');
  const [selectedLink, setSelectedLink] = useState<SavedLink | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Important');
  const [initialAddUrl, setInitialAddUrl] = useState<string>('');
  const [initialAddCategory, setInitialAddCategory] = useState<string>('');

  // Data State
  const [links, setLinks] = useState<SavedLink[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [linkToDelete, setLinkToDelete] = useState<SavedLink | null>(null);

  // Initialize Data & First Launch check
  useEffect(() => {
    async function init() {
      let storedLinks = await getStoredLinks();
      // If the only link is the old seeded sample link, clean it out
      if (
        storedLinks &&
        storedLinks.length === 1 &&
        storedLinks[0].id === 'sample-instagram-share'
      ) {
        storedLinks = [];
        await storeLinks([]);
      }
      setLinks(storedLinks || []);

      let storedCategories = await getStoredCategories();
      if (storedCategories && storedCategories.length > 0) {
        // Remove "Project Ideas" and remove "Unsorted" if it has no links
        const cleaned = storedCategories.filter((c) => {
          if (c.name.toLowerCase() === 'project ideas') return false;
          if (c.name.toLowerCase() === 'unsorted') {
            const hasLinks = (storedLinks || []).some(
              (l) => l.category.toLowerCase() === 'unsorted'
            );
            return hasLinks;
          }
          return true;
        });
        await storeCategories(cleaned);
        setCategories(cleaned);
      } else {
        setCategories([]);
        await storeCategories([]);
      }
    }
    init();
  }, []);

  const handleSplashFinish = async () => {
    const isDone = await hasCompletedFirstLaunch();
    if (!isDone) {
      setScreen('welcome');
    } else {
      setScreen('main');
    }
  };

  const handleWelcomeComplete = async () => {
    await setFirstLaunchCompleted(true);
    setScreen('main');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Toggle favorite helper
  const handleToggleFavorite = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = links.map((l) =>
      l.id === id ? { ...l, isFavorite: !l.isFavorite } : l
    );
    setLinks(updated);
    await storeLinks(updated);

    const target = updated.find((l) => l.id === id);
    if (target) {
      showToast(target.isFavorite ? 'Added to favorites' : 'Removed from favorites');
      if (selectedLink && selectedLink.id === id) {
        setSelectedLink(target);
      }
    }
  };

  // Add Link
  const handleSaveNewLink = async (newLinkData: {
    title: string;
    url: string;
    category: string;
    description?: string;
    isFavorite?: boolean;
  }) => {
    const now = Date.now();
    const domain = extractDomain(newLinkData.url);
    const newLink: SavedLink = {
      ...newLinkData,
      domain,
      isFavorite: newLinkData.isFavorite ?? false,
      id: `link-${now}`,
      createdAt: now,
      updatedAt: now,
    };
    const updated = [newLink, ...links];
    setLinks(updated);
    await storeLinks(updated);
    setScreen('main');
    showToast('Saved link to your private vault');
  };

  // Direct quick-save into "Unsorted" from Home Screen paste bar
  const handleQuickSaveLink = async (rawUrl: string) => {
    const normalized = normalizeUrl(rawUrl.trim());
    const domain = extractDomain(normalized);
    const serviceObj = detectService(normalized);
    const serviceId = serviceObj?.id;
    let title = generateSuggestedTitle(normalized) || domain;
    if (serviceId === 'instagram' || domain.includes('instagram')) title = 'Instagram';
    if (serviceId === 'youtube' || domain.includes('youtube')) title = 'YouTube';

    // Ensure "Unsorted" category exists
    let updatedCategories = [...categories];
    let unsortedCat = updatedCategories.find(
      (c) => c.name.toLowerCase() === 'unsorted'
    );
    if (!unsortedCat) {
      unsortedCat = {
        id: 'cat-unsorted',
        name: 'Unsorted',
        icon: 'Folder',
        color: '#718BA3',
        description: 'Quick saved links',
        isDefault: true,
      };
      updatedCategories = [unsortedCat, ...updatedCategories];
      setCategories(updatedCategories);
      await storeCategories(updatedCategories);
    }

    const now = Date.now();
    const newLink: SavedLink = {
      id: `link-${now}`,
      title,
      url: normalized,
      domain,
      category: 'Unsorted',
      description: `${title} saved via quick save`,
      isFavorite: false,
      createdAt: now,
      updatedAt: now,
      serviceId: serviceId || undefined,
    };

    const updatedLinks = [newLink, ...links];
    setLinks(updatedLinks);
    await storeLinks(updatedLinks);
    showToast('Saved to Unsorted');
  };

  // Edit Link
  const handleSaveEditedLink = async (updatedLink: SavedLink) => {
    const updated = links.map((l) => (l.id === updatedLink.id ? updatedLink : l));
    setLinks(updated);
    await storeLinks(updated);
    setSelectedLink(updatedLink);
    setScreen('details');
    showToast('Updated link details');
  };

  // Delete Link
  const handleConfirmDelete = async () => {
    if (!linkToDelete) return;
    const id = linkToDelete.id;
    const linkCategory = linkToDelete.category;
    const updated = links.filter((l) => l.id !== id);
    setLinks(updated);
    await storeLinks(updated);
    setLinkToDelete(null);

    // Auto-remove "Unsorted" folder if it becomes empty
    if (linkCategory && linkCategory.toLowerCase() === 'unsorted') {
      const remainingUnsorted = updated.filter(
        (l) => l.category.toLowerCase() === 'unsorted'
      );
      if (remainingUnsorted.length === 0) {
        const updatedCats = categories.filter(
          (c) => c.name.toLowerCase() !== 'unsorted'
        );
        setCategories(updatedCats);
        await storeCategories(updatedCats);
        if (screen === 'category-detail' && selectedCategory.toLowerCase() === 'unsorted') {
          setSelectedCategory('');
          setScreen('main');
        }
      }
    }

    if (selectedLink && selectedLink.id === id) {
      setSelectedLink(null);
      setScreen('main');
    }
    showToast('Removed link from vault');
  };

  // Batch Delete Links (e.g. from Select Links in CategoryDetailScreen)
  const handleDeleteMultipleLinks = async (ids: string[], categoryName: string) => {
    const updated = links.filter((l) => !ids.includes(l.id));
    setLinks(updated);
    await storeLinks(updated);

    // Auto-remove "Unsorted" folder if it becomes empty
    if (categoryName.toLowerCase() === 'unsorted') {
      const remainingUnsorted = updated.filter(
        (l) => l.category.toLowerCase() === 'unsorted'
      );
      if (remainingUnsorted.length === 0) {
        const updatedCats = categories.filter(
          (c) => c.name.toLowerCase() !== 'unsorted'
        );
        setCategories(updatedCats);
        await storeCategories(updatedCats);
        if (screen === 'category-detail' && selectedCategory.toLowerCase() === 'unsorted') {
          setSelectedCategory('');
          setScreen('main');
        }
        showToast('Empty Unsorted folder removed');
        return;
      }
    }

    showToast(`Deleted ${ids.length} ${ids.length === 1 ? 'link' : 'links'}`);
  };

  // Delete Single Link directly
  const handleDeleteSingleLink = async (link: SavedLink) => {
    const id = link.id;
    const linkCategory = link.category;
    const updated = links.filter((l) => l.id !== id);
    setLinks(updated);
    await storeLinks(updated);

    // Auto-remove "Unsorted" folder if it becomes empty
    if (linkCategory && linkCategory.toLowerCase() === 'unsorted') {
      const remainingUnsorted = updated.filter(
        (l) => l.category.toLowerCase() === 'unsorted'
      );
      if (remainingUnsorted.length === 0) {
        const updatedCats = categories.filter(
          (c) => c.name.toLowerCase() !== 'unsorted'
        );
        setCategories(updatedCats);
        await storeCategories(updatedCats);
        if (screen === 'category-detail' && selectedCategory.toLowerCase() === 'unsorted') {
          setSelectedCategory('');
          setScreen('main');
        }
        showToast('Empty Unsorted folder removed');
        return;
      }
    }

    if (selectedLink && selectedLink.id === id) {
      setSelectedLink(null);
      setScreen('main');
    }
    showToast('Removed link from vault');
  };

  // Delete Folder / Collection and clear all its links at once
  const handleDeleteFolder = async (categoryName: string) => {
    // 1. Remove all links in this category
    const remainingLinks = links.filter(
      (l) => l.category.toLowerCase() !== categoryName.toLowerCase()
    );
    setLinks(remainingLinks);
    await storeLinks(remainingLinks);

    // 2. Remove the category from categories
    const remainingCats = categories.filter(
      (c) => c.name.toLowerCase() !== categoryName.toLowerCase()
    );
    setCategories(remainingCats);
    await storeCategories(remainingCats);

    // 3. Return to main screen
    setSelectedCategory('');
    setScreen('main');
    showToast(`Deleted "${categoryName}" folder and cleared its links`);
  };

  // Add Category / Collection
  const handleAddCategory = async (catData: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...catData,
      id: `cat-${Date.now()}`,
    };
    const updated = [...categories, newCat];
    setCategories(updated);
    await storeCategories(updated);
  };

  // Open link details
  const handleSelectLink = (link: SavedLink) => {
    setSelectedLink(link);
    setScreen('details');
  };

  // Open Category detail
  const handleSelectCategory = (categoryName: string) => {
    if (categoryName === 'all') {
      setScreen('links');
    } else {
      setSelectedCategory(categoryName);
      setScreen('category-detail');
    }
  };

  // Open Add Link screen
  const handleOpenAdd = (initialUrl?: string, initialCat?: string) => {
    setInitialAddUrl(initialUrl || '');
    setInitialAddCategory(initialCat || '');
    setScreen('add');
  };

  // Render Subscreen
  const renderScreenContent = () => {
    if (screen === 'splash') {
      return <SplashScreen onFinish={handleSplashFinish} isDark={isDark} />;
    }

    if (screen === 'welcome') {
      return <WelcomeScreen onGetStarted={handleWelcomeComplete} isDark={isDark} />;
    }

    if (screen === 'search') {
      return (
        <SearchScreen
          links={links}
          categories={categories}
          onBack={() => setScreen('main')}
          onSelectLink={handleSelectLink}
          onSelectCategory={handleSelectCategory}
          onToggleFavorite={handleToggleFavorite}
          onShowToast={showToast}
          isDark={isDark}
        />
      );
    }

    if (screen === 'add') {
      return (
        <AddLinkScreen
          categories={categories}
          initialUrl={initialAddUrl}
          initialCategory={initialAddCategory}
          onSave={handleSaveNewLink}
          onCancel={() => setScreen('main')}
          onShowToast={showToast}
          isDark={isDark}
        />
      );
    }

    if (screen === 'details' && selectedLink) {
      return (
        <LinkDetailsScreen
          link={selectedLink}
          onBack={() => setScreen('main')}
          onEdit={(l) => {
            setSelectedLink(l);
            setScreen('edit');
          }}
          onDelete={(l) => setLinkToDelete(l)}
          onToggleFavorite={handleToggleFavorite}
          onShowToast={showToast}
          isDark={isDark}
        />
      );
    }

    if (screen === 'edit' && selectedLink) {
      return (
        <EditLinkScreen
          link={selectedLink}
          categories={categories}
          onSave={handleSaveEditedLink}
          onDelete={async (id) => {
            const updated = links.filter((l) => l.id !== id);
            setLinks(updated);
            await storeLinks(updated);
            setSelectedLink(null);
            setScreen('main');
            showToast('Link deleted');
          }}
          onCancel={() => setScreen('details')}
          onShowToast={showToast}
          isDark={isDark}
        />
      );
    }

    if (screen === 'category-detail') {
      const catObj = categories.find(
        (c) => c.name.toLowerCase() === selectedCategory.toLowerCase()
      );
      return (
        <CategoryDetailScreen
          categoryName={selectedCategory}
          category={catObj}
          links={links}
          onBack={() => setScreen('main')}
          onSelectLink={handleSelectLink}
          onEditLink={(link) => {
            setSelectedLink(link);
            setScreen('edit');
          }}
          onDeleteLink={handleDeleteSingleLink}
          onUpdateLink={handleSaveEditedLink}
          onDeleteFolder={handleDeleteFolder}
          onToggleFavorite={handleToggleFavorite}
          onOpenAddForCategory={(catName) => {
            handleOpenAdd('', catName);
          }}
          onDeleteMultipleLinks={handleDeleteMultipleLinks}
          onShowToast={showToast}
          isDark={isDark}
        />
      );
    }

    if (screen === 'links') {
      return (
        <LinksScreen
          links={links}
          categories={categories}
          onSelectLink={handleSelectLink}
          onToggleFavorite={handleToggleFavorite}
          onOpenAdd={() => handleOpenAdd()}
          onShowToast={showToast}
          isDark={isDark}
        />
      );
    }

    // Default Main Screen: HomeScreen
    return (
      <HomeScreen
        links={links}
        categories={categories}
        onSelectLink={handleSelectLink}
        onToggleFavorite={handleToggleFavorite}
        onOpenAdd={handleOpenAdd}
        onQuickSaveLink={handleQuickSaveLink}
        onOpenCategory={handleSelectCategory}
        onOpenSearch={() => setScreen('search')}
        onOpenAllLinks={() => setScreen('links')}
        onCreateCategory={handleAddCategory}
        onShowToast={showToast}
        isDark={isDark}
      />
    );
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 p-0 sm:p-4 select-none">
      {/* Smartphone Device Shell */}
      <div
        className={`w-full transition-all duration-300 flex flex-col relative overflow-hidden ${
          deviceFrame
            ? 'max-w-[430px] h-[100dvh] sm:h-[890px] sm:rounded-[46px] sm:shadow-2xl sm:shadow-black sm:border-[10px] sm:border-slate-800 ring-1 ring-slate-700/50'
            : 'max-w-2xl h-[100dvh] sm:h-[92vh] sm:rounded-3xl sm:shadow-xl sm:border border-slate-800'
        } ${isDark ? 'bg-[#0B0F19]' : 'bg-[#FFFFFF]'}`}
      >
        {/* Active Screen Viewport */}
        <main className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
          <div key={screen + (selectedCategory || '')} className="flex-1 flex flex-col h-full screen-enter">
            {renderScreenContent()}
          </div>
        </main>
      </div>

      {/* Global Toast */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
          isDark={isDark}
        />
      )}

      {/* Global Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(linkToDelete)}
        title="Delete Saved Link?"
        message={`Are you sure you want to delete "${linkToDelete?.title}"? It will be permanently removed from your private vault.`}
        confirmText="Delete"
        cancelText="Keep"
        isDangerous={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setLinkToDelete(null)}
        isDark={isDark}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <NidhiApp />
    </ThemeProvider>
  );
}
