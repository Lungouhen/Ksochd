import { withPrisma } from "@/lib/prisma";
import { getBrandingSettings } from "./branding.service";
import { Prisma } from "@prisma/client";

// ─── Types ──────────────────────────────────────────────────────────────

export type TemplateMeta = {
  id: string;
  name: string;
  type: string;
  isDefault: boolean;
  isActive: boolean;
  description: string | null;
  previewImage: string | null;
};

export type TemplateDetail = TemplateMeta & {
  layout: string;
  placeholders: Record<string, string> | null;
};

// ─── Default templates ──────────────────────────────────────────────────

const defaultIdCardTemplate = `
<div style="width:350px;padding:24px;border:2px solid {{primaryColor}};border-radius:12px;font-family:{{fontFamily}};background:#fff;">
  <div style="text-align:center;margin-bottom:16px;">
    <img src="{{logoUrl}}" alt="{{orgName}}" style="height:48px;" />
    <h2 style="color:{{primaryColor}};margin:8px 0 0;">{{orgName}}</h2>
    <p style="color:#64748b;font-size:12px;">{{orgTagline}}</p>
  </div>
  <div style="text-align:center;margin-bottom:16px;">
    <img src="{{profilePic}}" alt="" style="width:80px;height:80px;border-radius:50%;border:3px solid {{primaryColor}};" />
  </div>
  <div style="text-align:center;">
    <h3 style="margin:0;color:#1e293b;">{{name}}</h3>
    <p style="color:{{primaryColor}};font-weight:600;margin:4px 0;">{{member_id}}</p>
    <p style="color:#64748b;font-size:13px;">{{role}}</p>
  </div>
  <div style="margin-top:16px;padding-top:12px;border-top:1px solid #e2e8f0;font-size:12px;color:#475569;">
    <p><strong>Phone:</strong> {{phone}}</p>
    <p><strong>Email:</strong> {{email}}</p>
    <p><strong>Clan:</strong> {{clan}}</p>
    <p><strong>College:</strong> {{college}}</p>
    <p><strong>Status:</strong> {{membershipStatus}}</p>
    <p><strong>Joined:</strong> {{joinedDate}}</p>
  </div>
</div>
`.trim();

const defaultReceiptTemplate = `
<div style="width:500px;padding:32px;border:1px solid #e2e8f0;font-family:{{fontFamily}};background:#fff;">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
    <div>
      <img src="{{logoUrl}}" alt="{{orgName}}" style="height:40px;" />
      <h2 style="color:{{primaryColor}};margin:4px 0 0;">{{orgName}}</h2>
    </div>
    <div style="text-align:right;">
      <h3 style="color:#1e293b;margin:0;">RECEIPT</h3>
      <p style="color:{{primaryColor}};font-weight:600;margin:4px 0;">{{receipt_id}}</p>
      <p style="color:#64748b;font-size:13px;">{{date}}</p>
    </div>
  </div>
  <div style="margin-bottom:20px;padding:16px;background:#f8fafc;border-radius:8px;">
    <p><strong>Received from:</strong> {{name}}</p>
    <p><strong>Member ID:</strong> {{member_id}}</p>
    <p><strong>Phone:</strong> {{phone}}</p>
  </div>
  <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
    <thead>
      <tr style="border-bottom:2px solid {{primaryColor}};">
        <th style="text-align:left;padding:8px;">Description</th>
        <th style="text-align:right;padding:8px;">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom:1px solid #e2e8f0;">
        <td style="padding:8px;">{{purpose}}</td>
        <td style="text-align:right;padding:8px;">₹{{amount}}</td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td style="padding:8px;font-weight:600;">Total</td>
        <td style="text-align:right;padding:8px;font-weight:600;color:{{primaryColor}};">₹{{amount}}</td>
      </tr>
    </tfoot>
  </table>
  <div style="font-size:12px;color:#64748b;border-top:1px solid #e2e8f0;padding-top:12px;">
    <p><strong>Payment Ref:</strong> {{razorpayId}}</p>
    <p><strong>Status:</strong> {{status}}</p>
    <p style="margin-top:12px;">{{orgAddress}}</p>
    <p>{{orgEmail}} | {{orgWebsite}}</p>
  </div>
</div>
`.trim();

const defaultInvoiceTemplate = `
<div style="width:600px;padding:32px;border:1px solid #e2e8f0;font-family:{{fontFamily}};background:#fff;">
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;">
    <div>
      <img src="{{logoUrl}}" alt="{{orgName}}" style="height:48px;" />
      <h2 style="color:{{primaryColor}};margin:8px 0 0;">{{orgName}}</h2>
      <p style="color:#64748b;font-size:13px;">{{orgTagline}}</p>
      <p style="color:#64748b;font-size:12px;">{{orgAddress}}</p>
    </div>
    <div style="text-align:right;">
      <h2 style="color:#1e293b;margin:0;">INVOICE</h2>
      <p style="color:{{primaryColor}};font-weight:600;font-size:18px;">{{invoice_id}}</p>
      <p style="color:#64748b;font-size:13px;"><strong>Date:</strong> {{date}}</p>
      <p style="color:#64748b;font-size:13px;"><strong>Due:</strong> {{dueDate}}</p>
    </div>
  </div>
  <div style="margin-bottom:24px;padding:16px;background:#f8fafc;border-radius:8px;">
    <h4 style="margin:0 0 8px;color:#1e293b;">Bill To:</h4>
    <p style="margin:2px 0;"><strong>{{name}}</strong></p>
    <p style="margin:2px 0;color:#64748b;">{{email}}</p>
    <p style="margin:2px 0;color:#64748b;">{{phone}}</p>
  </div>
  <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
    <thead>
      <tr style="background:{{primaryColor}};color:#fff;">
        <th style="text-align:left;padding:10px;">#</th>
        <th style="text-align:left;padding:10px;">Description</th>
        <th style="text-align:right;padding:10px;">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom:1px solid #e2e8f0;">
        <td style="padding:10px;">1</td>
        <td style="padding:10px;">{{purpose}}</td>
        <td style="text-align:right;padding:10px;">₹{{amount}}</td>
      </tr>
    </tbody>
    <tfoot>
      <tr style="border-top:2px solid {{primaryColor}};">
        <td colspan="2" style="padding:10px;font-weight:600;">Total Due</td>
        <td style="text-align:right;padding:10px;font-weight:700;font-size:18px;color:{{primaryColor}};">₹{{amount}}</td>
      </tr>
    </tfoot>
  </table>
  <div style="font-size:12px;color:#64748b;border-top:1px solid #e2e8f0;padding-top:16px;">
    <p>Payment can be made via Razorpay. Contact {{orgEmail}} for assistance.</p>
    <p>{{orgWebsite}}</p>
  </div>
</div>
`.trim();

const defaultTemplates: TemplateDetail[] = [
  {
    id: "tpl-id-card",
    name: "Member ID Card",
    type: "id_card",
    isDefault: true,
    isActive: true,
    description: "Standard member identification card",
    previewImage: null,
    layout: defaultIdCardTemplate,
    placeholders: {
      name: "Member's full name",
      member_id: "Formatted member ID",
      phone: "Phone number",
      email: "Email address",
      clan: "Clan name",
      college: "College name",
      role: "Member role",
      membershipStatus: "Active/Pending/Expired",
      profilePic: "Profile picture URL",
      joinedDate: "Registration date",
    },
  },
  {
    id: "tpl-receipt",
    name: "Payment Receipt",
    type: "receipt",
    isDefault: true,
    isActive: true,
    description: "Standard payment receipt",
    previewImage: null,
    layout: defaultReceiptTemplate,
    placeholders: {
      receipt_id: "Formatted receipt ID",
      name: "Payer's name",
      member_id: "Member ID",
      phone: "Phone number",
      purpose: "Payment purpose",
      amount: "Payment amount",
      date: "Payment date",
      razorpayId: "Razorpay reference",
      status: "Payment status",
    },
  },
  {
    id: "tpl-invoice",
    name: "Invoice",
    type: "invoice",
    isDefault: true,
    isActive: true,
    description: "Standard invoice template",
    previewImage: null,
    layout: defaultInvoiceTemplate,
    placeholders: {
      invoice_id: "Formatted invoice ID",
      name: "Client name",
      email: "Client email",
      phone: "Client phone",
      purpose: "Invoice description",
      amount: "Invoice amount",
      date: "Invoice date",
      dueDate: "Due date",
    },
  },
];

// ─── Get all templates ──────────────────────────────────────────────────

export async function getTemplates(
  type?: string,
): Promise<TemplateMeta[]> {
  return withPrisma(
    async (client) => {
      const where = type ? { type, isActive: true } : { isActive: true };
      const templates = await client.outputTemplate.findMany({
        where,
        select: {
          id: true,
          name: true,
          type: true,
          isDefault: true,
          isActive: true,
          description: true,
          previewImage: true,
        },
        orderBy: [{ isDefault: "desc" }, { name: "asc" }],
      });
      if (!templates.length) {
        return type
          ? defaultTemplates.filter((t) => t.type === type)
          : defaultTemplates;
      }
      return templates;
    },
    () =>
      type
        ? defaultTemplates.filter((t) => t.type === type)
        : defaultTemplates,
  );
}

// ─── Get single template ────────────────────────────────────────────────

export async function getTemplate(
  id: string,
): Promise<TemplateDetail | null> {
  return withPrisma(
    async (client) => {
      const template = await client.outputTemplate.findUnique({
        where: { id },
      });
      if (!template) {
        return defaultTemplates.find((t) => t.id === id) ?? null;
      }
      return {
        id: template.id,
        name: template.name,
        type: template.type,
        isDefault: template.isDefault,
        isActive: template.isActive,
        description: template.description,
        previewImage: template.previewImage,
        layout: template.layout,
        placeholders: template.placeholders as Record<string, string> | null,
      };
    },
    () => defaultTemplates.find((t) => t.id === id) ?? null,
  );
}

// ─── Get default template for type ──────────────────────────────────────

export async function getDefaultTemplate(
  type: string,
): Promise<TemplateDetail | null> {
  return withPrisma(
    async (client) => {
      const template = await client.outputTemplate.findFirst({
        where: { type, isDefault: true, isActive: true },
      });
      if (!template) {
        return defaultTemplates.find((t) => t.type === type && t.isDefault) ?? null;
      }
      return {
        id: template.id,
        name: template.name,
        type: template.type,
        isDefault: template.isDefault,
        isActive: template.isActive,
        description: template.description,
        previewImage: template.previewImage,
        layout: template.layout,
        placeholders: template.placeholders as Record<string, string> | null,
      };
    },
    () => defaultTemplates.find((t) => t.type === type && t.isDefault) ?? null,
  );
}

// ─── Render a template with data ────────────────────────────────────────

export async function renderTemplate(
  templateId: string,
  data: Record<string, string>,
): Promise<string> {
  const template = await getTemplate(templateId);
  if (!template) throw new Error(`Template ${templateId} not found`);

  // Merge branding settings into data
  const branding = await getBrandingSettings();
  const mergedData: Record<string, string> = {
    ...Object.fromEntries(
      Object.entries(branding).map(([k, v]) => [k, String(v)]),
    ),
    ...data,
  };

  return resolveTemplate(template.layout, mergedData);
}

// ─── Render default template for a type ─────────────────────────────────

export async function renderDefaultTemplate(
  type: string,
  data: Record<string, string>,
): Promise<string> {
  const template = await getDefaultTemplate(type);
  if (!template) throw new Error(`No default template for type "${type}"`);

  const branding = await getBrandingSettings();
  const mergedData: Record<string, string> = {
    ...Object.fromEntries(
      Object.entries(branding).map(([k, v]) => [k, String(v)]),
    ),
    ...data,
  };

  return resolveTemplate(template.layout, mergedData);
}

// ─── Template resolution engine ─────────────────────────────────────────

function resolveTemplate(
  layout: string,
  data: Record<string, string>,
): string {
  return layout.replace(/\{\{(\w+)\}\}/g, (match, key: string) => {
    return data[key] ?? match;
  });
}

// ─── Create template ────────────────────────────────────────────────────

export async function createTemplate(
  input: {
    name: string;
    type: string;
    layout: string;
    placeholders?: Record<string, string>;
    description?: string;
    createdBy: string;
  },
): Promise<string> {
  return withPrisma(
    async (client) => {
      const template = await client.outputTemplate.create({
        data: {
          name: input.name,
          type: input.type,
          layout: input.layout,
          placeholders: input.placeholders !== undefined ? (input.placeholders as Prisma.InputJsonValue) : Prisma.JsonNull,
          description: input.description ?? null,
          createdBy: input.createdBy,
        },
      });
      return template.id;
    },
    () => "tpl-fallback",
  );
}

// ─── Update template ────────────────────────────────────────────────────

export async function updateTemplate(
  id: string,
  input: {
    name?: string;
    layout?: string;
    placeholders?: Record<string, string>;
    isDefault?: boolean;
    isActive?: boolean;
    description?: string;
  },
): Promise<void> {
  await withPrisma(
    async (client) => {
      // If setting as default, unset other defaults of same type
      if (input.isDefault) {
        const template = await client.outputTemplate.findUnique({
          where: { id },
          select: { type: true },
        });
        if (template) {
          await client.outputTemplate.updateMany({
            where: { type: template.type, isDefault: true },
            data: { isDefault: false },
          });
        }
      }
      await client.outputTemplate.update({
        where: { id },
        data: input,
      });
    },
    () => undefined,
  );
}
