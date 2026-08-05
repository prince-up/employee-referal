import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Select,
  Label,
  toast,
} from "@/components/ui";
import { mockEmployees, mockDepartments, mockDesignations } from "@/utils/mockData";
import { ArrowLeft, Save } from "lucide-react";

const schema = z.object({
  first_name: z.string().min(2, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Valid phone required"),
  gender: z.enum(["male", "female", "other"]),
  dob: z.string().min(1, "Date of birth required"),
  address: z.string().min(5, "Address required"),
  city: z.string().min(2, "City required"),
  state: z.string().min(2, "State required"),
  pincode: z.string().length(6, "6-digit pincode required"),
  department_id: z.string().min(1, "Department required"),
  designation_id: z.string().min(1, "Designation required"),
  joining_date: z.string().min(1, "Joining date required"),
  employment_type: z.enum(["full-time", "part-time", "contract", "intern"]),
  status: z.enum(["active", "inactive", "terminated", "on-leave"]),
  bank_name: z.string().min(2, "Bank name required"),
  bank_account: z.string().min(8, "Account number required"),
  ifsc_code: z.string().min(11, "Valid IFSC required"),
  pan_number: z.string().min(10, "Valid PAN required"),
  aadhar_number: z.string().length(12, "12-digit Aadhar required"),
  pf_number: z.string().optional(),
  esi_number: z.string().optional(),
  basic_salary: z.number().min(1000, "Minimum salary 1000"),
});

type FormData = z.infer<typeof schema>;

export default function EmployeeFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const existing = isEdit ? mockEmployees.find((e) => e.id === id) : null;
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: existing
      ? {
          first_name: existing.first_name,
          last_name: existing.last_name,
          email: existing.email,
          phone: existing.phone,
          gender: existing.gender,
          dob: existing.dob,
          address: existing.address,
          city: existing.city,
          state: existing.state,
          pincode: existing.pincode,
          department_id: existing.department_id,
          designation_id: existing.designation_id,
          joining_date: existing.joining_date,
          employment_type: existing.employment_type,
          status: existing.status,
          bank_name: existing.bank_name,
          bank_account: existing.bank_account,
          ifsc_code: existing.ifsc_code,
          pan_number: existing.pan_number,
          aadhar_number: existing.aadhar_number,
          pf_number: existing.pf_number ?? "",
          esi_number: existing.esi_number ?? "",
          basic_salary: existing.basic_salary,
        }
      : {
          employment_type: "full-time",
          status: "active",
          gender: "male",
          basic_salary: 30000,
        },
  });

  const selectedDept = watch("department_id");
  const filteredDesignations = mockDesignations.filter(
    (d) => !selectedDept || d.department_id === selectedDept
  );

  const onSubmit = async (_data: FormData) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsLoading(false);
    toast(
      isEdit ? "Employee updated successfully" : "Employee added successfully",
      "success"
    );
    navigate("/employees");
  };



  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/employees")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h2 className="text-2xl font-bold">
              {isEdit ? "Edit Employee" : "Add New Employee"}
            </h2>
            <p className="text-muted-foreground text-sm">
              {isEdit ? `Editing: ${existing?.first_name} ${existing?.last_name}` : "Fill in the details to add a new employee"}
            </p>
          </div>
        </div>
        <Button onClick={handleSubmit(onSubmit)} isLoading={isLoading}>
          <Save className="h-4 w-4" /> {isEdit ? "Save Changes" : "Add Employee"}
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <span>👤</span> Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label required>First Name</Label>
              <Input {...register("first_name")} placeholder="John" error={errors.first_name?.message} />
            </div>
            <div className="space-y-1.5">
              <Label required>Last Name</Label>
              <Input {...register("last_name")} placeholder="Doe" error={errors.last_name?.message} />
            </div>
            <div className="space-y-1.5">
              <Label required>Email</Label>
              <Input {...register("email")} type="email" placeholder="john@company.com" error={errors.email?.message} />
            </div>
            <div className="space-y-1.5">
              <Label required>Phone</Label>
              <Input {...register("phone")} placeholder="9876543210" error={errors.phone?.message} />
            </div>
            <div className="space-y-1.5">
              <Label required>Gender</Label>
              <Select
                {...register("gender")}
                options={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                  { value: "other", label: "Other" },
                ]}
                error={errors.gender?.message}
              />
            </div>
            <div className="space-y-1.5">
              <Label required>Date of Birth</Label>
              <Input {...register("dob")} type="date" error={errors.dob?.message} />
            </div>
          </CardContent>
        </Card>

        {/* Employment */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <span>💼</span> Employment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label required>Department</Label>
              <Select
                {...register("department_id")}
                options={mockDepartments.map((d) => ({ value: d.id, label: d.name }))}
                placeholder="Select department"
                error={errors.department_id?.message}
              />
            </div>
            <div className="space-y-1.5">
              <Label required>Designation</Label>
              <Select
                {...register("designation_id")}
                options={filteredDesignations.map((d) => ({ value: d.id, label: d.title }))}
                placeholder="Select designation"
                error={errors.designation_id?.message}
              />
            </div>
            <div className="space-y-1.5">
              <Label required>Joining Date</Label>
              <Input {...register("joining_date")} type="date" error={errors.joining_date?.message} />
            </div>
            <div className="space-y-1.5">
              <Label required>Employment Type</Label>
              <Select
                {...register("employment_type")}
                options={[
                  { value: "full-time", label: "Full Time" },
                  { value: "part-time", label: "Part Time" },
                  { value: "contract", label: "Contract" },
                  { value: "intern", label: "Intern" },
                ]}
                error={errors.employment_type?.message}
              />
            </div>
            <div className="space-y-1.5">
              <Label required>Status</Label>
              <Select
                {...register("status")}
                options={[
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                  { value: "on-leave", label: "On Leave" },
                  { value: "terminated", label: "Terminated" },
                ]}
                error={errors.status?.message}
              />
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <span>📍</span> Address
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <Label required>Street Address</Label>
              <Input {...register("address")} placeholder="123 MG Road" error={errors.address?.message} />
            </div>
            <div className="space-y-1.5">
              <Label required>City</Label>
              <Input {...register("city")} placeholder="Bangalore" error={errors.city?.message} />
            </div>
            <div className="space-y-1.5">
              <Label required>State</Label>
              <Input {...register("state")} placeholder="Karnataka" error={errors.state?.message} />
            </div>
            <div className="space-y-1.5">
              <Label required>Pincode</Label>
              <Input {...register("pincode")} placeholder="560001" error={errors.pincode?.message} />
            </div>
          </CardContent>
        </Card>

        {/* Bank & Compliance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <span>🏦</span> Bank & Compliance
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label required>Bank Name</Label>
              <Input {...register("bank_name")} placeholder="HDFC Bank" error={errors.bank_name?.message} />
            </div>
            <div className="space-y-1.5">
              <Label required>Account Number</Label>
              <Input {...register("bank_account")} placeholder="12345678901234" error={errors.bank_account?.message} />
            </div>
            <div className="space-y-1.5">
              <Label required>IFSC Code</Label>
              <Input {...register("ifsc_code")} placeholder="HDFC0001234" error={errors.ifsc_code?.message} />
            </div>
            <div className="space-y-1.5">
              <Label required>PAN Number</Label>
              <Input {...register("pan_number")} placeholder="ABCDE1234F" error={errors.pan_number?.message} />
            </div>
            <div className="space-y-1.5">
              <Label required>Aadhar Number</Label>
              <Input {...register("aadhar_number")} placeholder="123456789012" error={errors.aadhar_number?.message} />
            </div>
            <div className="space-y-1.5">
              <Label>PF Number</Label>
              <Input {...register("pf_number")} placeholder="PF001234" />
            </div>
            <div className="space-y-1.5">
              <Label>ESI Number</Label>
              <Input {...register("esi_number")} placeholder="ESI001234" />
            </div>
          </CardContent>
        </Card>

        {/* Salary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <span>💰</span> Salary Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label required>Basic Salary (₹/month)</Label>
              <Input
                {...register("basic_salary", { valueAsNumber: true })}
                type="number"
                placeholder="50000"
                error={errors.basic_salary?.message}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-3 justify-end">
          <Button variant="outline" type="button" onClick={() => navigate("/employees")}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            <Save className="h-4 w-4" />
            {isEdit ? "Save Changes" : "Add Employee"}
          </Button>
        </div>
      </form>
    </div>
  );
}
