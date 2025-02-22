package com.RBS.demo.service;

import com.RBS.demo.model.ItemCategory;
import com.RBS.demo.model.MenuItem;
import com.RBS.demo.model.User;

import java.util.List;

public interface MenuItemService {
    MenuItem addMenuItem(MenuItem menuItem);
    List<MenuItem> getAll();
    MenuItem getMenuItemById(int itemId);
    void deleteMenuItemById(int itemId);
    MenuItem updateMenuItem(MenuItem menuItem, int itemId);
     MenuItem findByItemId( int itemId);

    List<MenuItem> getMenuItemsByCategory(ItemCategory itemCategory);
}
