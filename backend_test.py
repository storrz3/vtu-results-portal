#!/usr/bin/env python3
"""
Backend API Test Suite for VTU Results Portal
Tests the /api/validate endpoint with various scenarios
"""

import requests
import sys
import json
from datetime import datetime

class VTUPortalAPITester:
    def __init__(self, base_url="http://localhost:3000"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            status = "✅ PASS"
        else:
            status = "❌ FAIL"
        
        result = f"{status} - {name}"
        if details:
            result += f" | {details}"
        
        print(result)
        self.test_results.append({
            "name": name,
            "success": success,
            "details": details
        })
        return success

    def test_api_endpoint(self, name, endpoint, expected_status, expected_fields=None):
        """Test a single API endpoint"""
        url = f"{self.base_url}/{endpoint}"
        
        try:
            response = requests.get(url, timeout=10)
            
            # Check status code
            if response.status_code != expected_status:
                return self.log_test(
                    name, 
                    False, 
                    f"Expected status {expected_status}, got {response.status_code}"
                )
            
            # For successful responses, check JSON structure
            if expected_status == 200:
                try:
                    data = response.json()
                    
                    # Check if response has 'ok' field and it's true
                    if not data.get('ok'):
                        return self.log_test(
                            name, 
                            False, 
                            f"Response 'ok' field is false or missing: {data.get('error', 'No error message')}"
                        )
                    
                    # Check if student data exists
                    if 'student' not in data:
                        return self.log_test(
                            name, 
                            False, 
                            "Missing 'student' field in response"
                        )
                    
                    student = data['student']
                    
                    # Check expected fields if provided
                    if expected_fields:
                        missing_fields = []
                        for field in expected_fields:
                            if field not in student:
                                missing_fields.append(field)
                        
                        if missing_fields:
                            return self.log_test(
                                name, 
                                False, 
                                f"Missing fields: {', '.join(missing_fields)}"
                            )
                    
                    # Check subjects array
                    if 'subjects' in student:
                        subjects_count = len(student['subjects'])
                        return self.log_test(
                            name, 
                            True, 
                            f"Found student with {subjects_count} subjects"
                        )
                    else:
                        return self.log_test(
                            name, 
                            False, 
                            "Missing 'subjects' field in student data"
                        )
                        
                except json.JSONDecodeError:
                    return self.log_test(
                        name, 
                        False, 
                        "Invalid JSON response"
                    )
            
            # For error responses, check error message
            elif expected_status in [403, 500]:
                try:
                    data = response.json()
                    if data.get('ok') is False and 'error' in data:
                        return self.log_test(
                            name, 
                            True, 
                            f"Proper error response: {data['error']}"
                        )
                    else:
                        return self.log_test(
                            name, 
                            False, 
                            "Error response missing proper structure"
                        )
                except json.JSONDecodeError:
                    return self.log_test(
                        name, 
                        False, 
                        "Invalid JSON in error response"
                    )
            
            return self.log_test(name, True, f"Status {response.status_code}")
            
        except requests.exceptions.RequestException as e:
            return self.log_test(
                name, 
                False, 
                f"Request failed: {str(e)}"
            )

    def run_all_tests(self):
        """Run comprehensive test suite"""
        print("🚀 Starting VTU Portal API Tests")
        print("=" * 50)
        
        # Test valid USNs (as mentioned in the request)
        expected_fields = ['usn', 'fullName', 'totalMarks', 'percentage', 'sgpa', 'subjects']
        
        self.test_api_endpoint(
            "Valid USN: 3VC24CD001",
            "api/validate?usn=3VC24CD001",
            200,
            expected_fields
        )
        
        self.test_api_endpoint(
            "Valid USN: 3VC24CD002", 
            "api/validate?usn=3VC24CD002",
            200,
            expected_fields
        )
        
        self.test_api_endpoint(
            "Valid USN: 3VC24CD003",
            "api/validate?usn=3VC24CD003", 
            200,
            expected_fields
        )
        
        # Test invalid USN
        self.test_api_endpoint(
            "Invalid USN: INVALID123",
            "api/validate?usn=INVALID123",
            403
        )
        
        # Test empty parameters
        self.test_api_endpoint(
            "Empty USN parameter",
            "api/validate?usn=",
            403
        )
        
        # Test no parameters
        self.test_api_endpoint(
            "No parameters",
            "api/validate",
            403
        )
        
        # Test with fullName parameter (if any student names are known)
        self.test_api_endpoint(
            "Search by name: A SAKSHI",
            "api/validate?fullName=A SAKSHI",
            200,
            expected_fields
        )
        
        # Test case insensitive name search
        self.test_api_endpoint(
            "Case insensitive name: a sakshi",
            "api/validate?fullName=a sakshi",
            200,
            expected_fields
        )
        
        # Test invalid name
        self.test_api_endpoint(
            "Invalid name: NONEXISTENT STUDENT",
            "api/validate?fullName=NONEXISTENT STUDENT",
            403
        )
        
        # Test both parameters together
        self.test_api_endpoint(
            "Both USN and name: 3VC24CD001 + A SAKSHI",
            "api/validate?usn=3VC24CD001&fullName=A SAKSHI",
            200,
            expected_fields
        )

    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 50)
        print("📊 TEST SUMMARY")
        print("=" * 50)
        print(f"Total Tests: {self.tests_run}")
        print(f"Passed: {self.tests_passed}")
        print(f"Failed: {self.tests_run - self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        if self.tests_passed == self.tests_run:
            print("\n🎉 All tests passed! API is working correctly.")
            return 0
        else:
            print(f"\n⚠️  {self.tests_run - self.tests_passed} test(s) failed.")
            print("\nFailed tests:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  - {result['name']}: {result['details']}")
            return 1

def main():
    """Main test runner"""
    print(f"VTU Portal API Test Suite - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    tester = VTUPortalAPITester()
    tester.run_all_tests()
    return tester.print_summary()

if __name__ == "__main__":
    sys.exit(main())