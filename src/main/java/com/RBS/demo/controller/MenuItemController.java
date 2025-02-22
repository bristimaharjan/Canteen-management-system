package com.RBS.demo.controller;

import com.RBS.demo.model.ItemCategory;
import com.RBS.demo.model.MenuItem;
import com.RBS.demo.service.MenuItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/menu_items")
public class MenuItemController {

    @Autowired
    private MenuItemService menuItemService;

    @PostMapping("/add")
    public MenuItem addMenuItem(@RequestBody MenuItem menuItem){
        System.out.println("Received menu item: " + menuItem);
        return menuItemService.addMenuItem(menuItem);
    }

    @GetMapping("/list")
    public List<MenuItem> getAll(){
        return menuItemService.getAll();
    }

    @GetMapping("/{itemId}")
    public MenuItem findByItemId(@PathVariable int itemId){
        return menuItemService.getMenuItemById(itemId);
    }

    @DeleteMapping("/{itemId}")
    public Map<String, Boolean> deleteMenuItemById(@PathVariable int itemId) {
        menuItemService.deleteMenuItemById(itemId); // Calls service to handle deletion
        return Map.of("Success", true); // Returns success status as a JSON response
    }

    @PutMapping("{itemId}")
    public ResponseEntity<MenuItem> updateMenuItem(@RequestBody MenuItem menuItem, @PathVariable int itemId) {
        try {
            MenuItem updatedItem = menuItemService.updateMenuItem(menuItem, itemId);
            return ResponseEntity.ok(updatedItem);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // Handle not found case
        }
    }
    @GetMapping("/items/category/{category}")
    public ResponseEntity<List<MenuItem>> getMenuItemsByCategory(@PathVariable ItemCategory itemCategory) {
        List<MenuItem> items = menuItemService.getMenuItemsByCategory(itemCategory);
        return items.isEmpty()
                ? ResponseEntity.noContent().build()
                : ResponseEntity.ok(items);
    }
}
