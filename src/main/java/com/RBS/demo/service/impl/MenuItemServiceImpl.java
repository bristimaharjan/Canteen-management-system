package com.RBS.demo.service.impl;


import com.RBS.demo.model.ItemCategory;
import com.RBS.demo.model.MenuItem;
import com.RBS.demo.repository.CartItemRepository;
import com.RBS.demo.repository.MenuItemRepository;
import com.RBS.demo.repository.OrderItemRepository;
import com.RBS.demo.service.MenuItemService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class MenuItemServiceImpl implements MenuItemService {
    @Autowired
    private MenuItemRepository menuItemRepository;
    @Autowired
    private CartItemRepository cartItemRepository;
    @Autowired
    private OrderItemRepository orderItemRepository;


    @Override
    public MenuItem addMenuItem(MenuItem menuItem) {
        return menuItemRepository.save(menuItem);
    }

    @Override
    public List<MenuItem> getAll() {
        return menuItemRepository.findAll();
    }

    @Override
    public MenuItem getMenuItemById(int itemId) {
        Optional<MenuItem> optionalMenuItem = menuItemRepository.findById(itemId);
        MenuItem menuItem = optionalMenuItem.orElseThrow((() -> new RuntimeException("Item not found")));
        return menuItem;
    }

    @Override
    @Transactional
    public void deleteMenuItemById(int itemId) {
        getMenuItemById(itemId);
        cartItemRepository.deleteByMenuItem_ItemId(itemId);
        orderItemRepository.deleteByMenuItem_ItemId(itemId);
        if (menuItemRepository.existsById(itemId)) {
            menuItemRepository.deleteById(itemId);
        } else {
            throw new RuntimeException("MenuItem with ID " + itemId + " not found.");
        }
    }


    @Override
    public MenuItem updateMenuItem(MenuItem newMenuItem, int itemId) {
        // Fetch existing menu item
        MenuItem existingMenuItem = menuItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Menu item not found with ID: " + itemId));

        // Update fields selectively
        if (newMenuItem.getItemName() != null) {
            existingMenuItem.setItemName(newMenuItem.getItemName());
        }
        if (newMenuItem.getItemPrice() != null) {
            existingMenuItem.setItemPrice(newMenuItem.getItemPrice());
        }
        if (newMenuItem.getItemCategory() != null) {
            existingMenuItem.setItemCategory(newMenuItem.getItemCategory());
        }

        // Save updated menu item
        return menuItemRepository.save(existingMenuItem);
    }

    @Override
    public MenuItem findByItemId(int itemId) {
        Optional<MenuItem> optionalUser = menuItemRepository.findById(itemId);
        MenuItem menuItem= optionalUser.orElseThrow((()->new RuntimeException("Menu not found")));
        return menuItem;
    }
    @Override
    public List<MenuItem> getMenuItemsByCategory(ItemCategory itemCategory) {
        return menuItemRepository.findByItemCategory(itemCategory);
    }
}
