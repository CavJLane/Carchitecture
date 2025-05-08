import type {
  Fleet, Brand, Car, Driver, Speedometer,
  Speedometer_Source, GPS_Mode, Analog_Mode,
  Fleet_Link, GPS_Mode_Link, Analog_Mode_Link
} from '../types/fleet-management'

// Fleets
export const fleets: Fleet[] = [
  { Fleet_id: 1, Fleet_Name: "Main Fleet" },
  { Fleet_id: 2, Fleet_Name: "Secondary Fleet" },
  { Fleet_id: 3, Fleet_Name: "Special Operations Fleet" }
]

// Brands
export const brands: Brand[] = [
  { Brand_id: 1, Brand_Name: "Toyota", Speedometer_Type: "GPS" },
  { Brand_id: 2, Brand_Name: "Honda", Speedometer_Type: "Analog" },
  { Brand_id: 3, Brand_Name: "Ford", Speedometer_Type: "GPS" }
]

// Drivers
export const drivers: Driver[] = [
  { Driver_id: 1, Driver_Name: "John Smith" },
  { Driver_id: 2, Driver_Name: "Jane Doe" },
  { Driver_id: 3, Driver_Name: "Bob Johnson" }
]

// Cars
export const cars: Car[] = [
  { Car_id: 1, Brand_id: 1, Driver_id: 1 }, // Toyota
  { Car_id: 2, Brand_id: 2, Driver_id: 2 }, // Honda
  { Car_id: 3, Brand_id: 3, Driver_id: 3 }, // Ford
  { Car_id: 4, Brand_id: 1, Driver_id: 1 }, // Toyota (multiple fleets)
  { Car_id: 5, Brand_id: 2, Driver_id: 2 }, // Honda (multiple fleets)
  { Car_id: 6, Brand_id: 3, Driver_id: 3 }, // Ford
  { Car_id: 7, Brand_id: 1, Driver_id: 1 }, // Toyota
  { Car_id: 8, Brand_id: 2, Driver_id: 2 }, // Honda
  { Car_id: 9, Brand_id: 1, Driver_id: 1 }  // Toyota (no speedometer)
]

// Fleet Links
export const fleet_links: Fleet_Link[] = [
  { Fleet_id: 1, Car_id: 1 },  // Main Fleet - Car 1
  { Fleet_id: 1, Car_id: 2 },  // Main Fleet - Car 2
  { Fleet_id: 2, Car_id: 3 },  // Secondary Fleet - Car 3
  { Fleet_id: 1, Car_id: 4 },  // Main Fleet - Car 4 (multiple fleets)
  { Fleet_id: 2, Car_id: 4 },  // Secondary Fleet - Car 4 (multiple fleets)
  { Fleet_id: 2, Car_id: 5 },  // Secondary Fleet - Car 5 (multiple fleets)
  { Fleet_id: 3, Car_id: 5 },  // Special Ops Fleet - Car 5 (multiple fleets)
  { Fleet_id: 3, Car_id: 6 },  // Special Ops Fleet - Car 6
  { Fleet_id: 1, Car_id: 7 },  // Main Fleet - Car 7
  { Fleet_id: 2, Car_id: 8 },  // Secondary Fleet - Car 8
  { Fleet_id: 1, Car_id: 9 }   // Main Fleet - Car 9 (no speedometer)
]

// Speedometers
export const speedometers: Speedometer[] = [
  { Speedometer_id: 1, Car_id: 1 }, // First speedometer for Car 1
  { Speedometer_id: 2, Car_id: 1 }, // Second speedometer for Car 1
  { Speedometer_id: 3, Car_id: 2 }, // First speedometer for Car 2
  { Speedometer_id: 4, Car_id: 2 }, // Second speedometer for Car 2
  { Speedometer_id: 5, Car_id: 3 }, // Speedometer for Car 3
  { Speedometer_id: 6, Car_id: 4 }, // First speedometer for Car 4
  { Speedometer_id: 7, Car_id: 4 }, // Second speedometer for Car 4
  { Speedometer_id: 8, Car_id: 5 }, // First speedometer for Car 5
  { Speedometer_id: 9, Car_id: 5 }, // Second speedometer for Car 5
  { Speedometer_id: 10, Car_id: 6 }, // Speedometer for Car 6
  { Speedometer_id: 11, Car_id: 7 }, // Speedometer for Car 7
  { Speedometer_id: 12, Car_id: 8 }  // Speedometer for Car 8
]

// Speedometer Sources
export const speedometer_sources: Speedometer_Source[] = [
  { Speedometer_Source_id: 1, Minimum_Speed: 0, Maximum_Speed: 120 },
  { Speedometer_Source_id: 2, Minimum_Speed: 0, Maximum_Speed: 160 },
  { Speedometer_Source_id: 3, Minimum_Speed: 0, Maximum_Speed: 200 }
]

// GPS Modes
export const gps_modes: GPS_Mode[] = [
  { GPS_Mode_id: 1, GPS_Mode_Name: "High Precision", GPS_Mode_Type: "GPS", Accuracy: 0.1 },
  { GPS_Mode_id: 2, GPS_Mode_Name: "Standard", GPS_Mode_Type: "GPS", Accuracy: 1.0 },
  { GPS_Mode_id: 3, GPS_Mode_Name: "High Precision", GPS_Mode_Type: "GPS", Accuracy: 0.1 },
  { GPS_Mode_id: 4, GPS_Mode_Name: "Standard", GPS_Mode_Type: "GPS", Accuracy: 1.0 },
  { GPS_Mode_id: 5, GPS_Mode_Name: "High Precision", GPS_Mode_Type: "GPS", Accuracy: 0.1 },
  { GPS_Mode_id: 6, GPS_Mode_Name: "Enhanced", GPS_Mode_Type: "GPS", Accuracy: 0.5 }
]

// Analog Modes
export const analog_modes: Analog_Mode[] = [
  { Analog_Mode_id: 1, Analog_Mode_Name: "Standard", Analog_Mode_Type: "Analog", Accuracy: 2.0 },
  { Analog_Mode_id: 2, Analog_Mode_Name: "High Precision", Analog_Mode_Type: "Analog", Accuracy: 1.0 },
  { Analog_Mode_id: 3, Analog_Mode_Name: "Standard", Analog_Mode_Type: "Analog", Accuracy: 2.0 },
  { Analog_Mode_id: 4, Analog_Mode_Name: "High Precision", Analog_Mode_Type: "Analog", Accuracy: 1.0 },
  { Analog_Mode_id: 5, Analog_Mode_Name: "Standard", Analog_Mode_Type: "Analog", Accuracy: 2.0 },
  { Analog_Mode_id: 6, Analog_Mode_Name: "Enhanced", Analog_Mode_Type: "Analog", Accuracy: 1.5 }
]

// GPS Mode Links
export const gps_mode_links: GPS_Mode_Link[] = [
  // Car 1 Speedometer 1
  { GPS_Mode_Link_id: 1, Speedometer_Source_id: 1, Speedometer_id: 1, GPS_Mode_id: 1 }, // High Precision
  { GPS_Mode_Link_id: 2, Speedometer_Source_id: 1, Speedometer_id: 1, GPS_Mode_id: 6 }, // Enhanced
  
  // Car 1 Speedometer 2
  { GPS_Mode_Link_id: 3, Speedometer_Source_id: 2, Speedometer_id: 2, GPS_Mode_id: 2 }, // Standard
  { GPS_Mode_Link_id: 4, Speedometer_Source_id: 2, Speedometer_id: 2, GPS_Mode_id: 6 }, // Enhanced
  
  // Car 2 Speedometer 3
  { GPS_Mode_Link_id: 5, Speedometer_Source_id: 3, Speedometer_id: 3, GPS_Mode_id: 3 }, // High Precision
  { GPS_Mode_Link_id: 6, Speedometer_Source_id: 3, Speedometer_id: 3, GPS_Mode_id: 6 }, // Enhanced
  
  // Car 2 Speedometer 4
  { GPS_Mode_Link_id: 7, Speedometer_Source_id: 1, Speedometer_id: 4, GPS_Mode_id: 4 }, // Standard
  
  // Car 3 Speedometer 5
  { GPS_Mode_Link_id: 8, Speedometer_Source_id: 1, Speedometer_id: 5, GPS_Mode_id: 5 }, // High Precision
  
  // Car 4 Speedometer 6 (multiple modes)
  { GPS_Mode_Link_id: 9, Speedometer_Source_id: 1, Speedometer_id: 6, GPS_Mode_id: 1 }, // High Precision
  { GPS_Mode_Link_id: 10, Speedometer_Source_id: 1, Speedometer_id: 6, GPS_Mode_id: 2 }, // Standard
  { GPS_Mode_Link_id: 11, Speedometer_Source_id: 1, Speedometer_id: 6, GPS_Mode_id: 6 }, // Enhanced
  
  // Car 4 Speedometer 7
  { GPS_Mode_Link_id: 12, Speedometer_Source_id: 2, Speedometer_id: 7, GPS_Mode_id: 3 }, // High Precision
  
  // Car 5 Speedometer 8
  { GPS_Mode_Link_id: 13, Speedometer_Source_id: 3, Speedometer_id: 8, GPS_Mode_id: 4 }, // Standard
  
  // Car 5 Speedometer 9
  { GPS_Mode_Link_id: 14, Speedometer_Source_id: 1, Speedometer_id: 9, GPS_Mode_id: 5 }, // High Precision
  
  // Car 6 Speedometer 10
  { GPS_Mode_Link_id: 15, Speedometer_Source_id: 2, Speedometer_id: 10, GPS_Mode_id: 6 }, // Enhanced
  
  // Car 7 Speedometer 11
  { GPS_Mode_Link_id: 16, Speedometer_Source_id: 3, Speedometer_id: 11, GPS_Mode_id: 1 }, // High Precision
  
  // Car 8 Speedometer 12
  { GPS_Mode_Link_id: 17, Speedometer_Source_id: 1, Speedometer_id: 12, GPS_Mode_id: 2 }  // Standard
]

// Analog Mode Links
export const analog_mode_links: Analog_Mode_Link[] = [
  // Car 1 Speedometer 1
  { Analog_Mode_Link_id: 1, Speedometer_Source_id: 1, Speedometer_id: 1, Analog_Mode_id: 1 }, // Standard
  { Analog_Mode_Link_id: 2, Speedometer_Source_id: 1, Speedometer_id: 1, Analog_Mode_id: 6 }, // Enhanced
  
  // Car 1 Speedometer 2
  { Analog_Mode_Link_id: 3, Speedometer_Source_id: 2, Speedometer_id: 2, Analog_Mode_id: 2 }, // High Precision
  { Analog_Mode_Link_id: 4, Speedometer_Source_id: 2, Speedometer_id: 2, Analog_Mode_id: 6 }, // Enhanced
  
  // Car 2 Speedometer 3
  { Analog_Mode_Link_id: 5, Speedometer_Source_id: 3, Speedometer_id: 3, Analog_Mode_id: 3 }, // Standard
  { Analog_Mode_Link_id: 6, Speedometer_Source_id: 3, Speedometer_id: 3, Analog_Mode_id: 6 }, // Enhanced
  
  // Car 2 Speedometer 4
  { Analog_Mode_Link_id: 7, Speedometer_Source_id: 1, Speedometer_id: 4, Analog_Mode_id: 4 }, // High Precision
  
  // Car 3 Speedometer 5
  { Analog_Mode_Link_id: 8, Speedometer_Source_id: 1, Speedometer_id: 5, Analog_Mode_id: 5 }, // Standard
  
  // Car 4 Speedometer 6 (multiple modes)
  { Analog_Mode_Link_id: 9, Speedometer_Source_id: 1, Speedometer_id: 6, Analog_Mode_id: 1 }, // Standard
  { Analog_Mode_Link_id: 10, Speedometer_Source_id: 1, Speedometer_id: 6, Analog_Mode_id: 2 }, // High Precision
  { Analog_Mode_Link_id: 11, Speedometer_Source_id: 1, Speedometer_id: 6, Analog_Mode_id: 6 }, // Enhanced
  
  // Car 4 Speedometer 7
  { Analog_Mode_Link_id: 12, Speedometer_Source_id: 2, Speedometer_id: 7, Analog_Mode_id: 3 }, // Standard
  
  // Car 5 Speedometer 8
  { Analog_Mode_Link_id: 13, Speedometer_Source_id: 3, Speedometer_id: 8, Analog_Mode_id: 4 }, // High Precision
  
  // Car 5 Speedometer 9
  { Analog_Mode_Link_id: 14, Speedometer_Source_id: 1, Speedometer_id: 9, Analog_Mode_id: 5 }, // Standard
  
  // Car 6 Speedometer 10
  { Analog_Mode_Link_id: 15, Speedometer_Source_id: 2, Speedometer_id: 10, Analog_Mode_id: 6 }, // Enhanced
  
  // Car 7 Speedometer 11
  { Analog_Mode_Link_id: 16, Speedometer_Source_id: 3, Speedometer_id: 11, Analog_Mode_id: 1 }, // Standard
  
  // Car 8 Speedometer 12
  { Analog_Mode_Link_id: 17, Speedometer_Source_id: 1, Speedometer_id: 12, Analog_Mode_id: 2 }  // High Precision
] 